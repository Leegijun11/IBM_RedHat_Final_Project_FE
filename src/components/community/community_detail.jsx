import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getCommunityDetail,toggleCommunityLike,deleteCommunity, getComments, createComments,createCommentLike,deleteCommentLike } from "../../services/community_api";
import { getImageUrl } from "../../hooks/imageUrl";
import { useModal } from "../../hooks/useModal";
import CommentCard from "../../components/Community/Comment_card"; 
import "../../styles/community_detail.css"; 

const CommunityDetail = () => {

    const {f_id}=useParams()
    const navigate=useNavigate()
    const { user } = useAuth();
    const { showAlert, showConfirm } = useModal(); 
    const [comments, setComments] = useState([])
    const [commentInput, setCommentInput] = useState("")
    const [post, setPost]=useState(null)

    const [isInputOpen, setIsInputOpen] = useState(false);

    useEffect(()=>{
        const fetchDetail=async()=>{
            try{
                const data=await getCommunityDetail(f_id)
                setPost(data)

                const commentData=await getComments(f_id)
                setComments(commentData)
            } catch(error){
                console.error("게시글 불러오기 실패:", error)
                showAlert("게시글을 불러올 수 없습니다.")
                navigate("/community")
            }
        }
        fetchDetail()
    }, [f_id, navigate])


    const handleLikeClick = async () => {
        try {
            await toggleCommunityLike(f_id, post.is_liked);
            setPost((before) => ({
                ...before,
                is_liked: !before.is_liked,
                f_like_count: before.is_liked ? before.f_like_count - 1 : before.f_like_count + 1 
            }));
        } catch (error) {
            if (error.response?.data?.detail === "이미 좋아요를 누른 게시글") {
                setPost((before) => ({ ...before, is_liked: true }));
                return;
            }
            
            console.error("좋아요 처리 실패:", error);
            showAlert("좋아요 처리 실패");
        }
    };


    const handleDeleteClick = async () => {
        const confirmed = await showConfirm("정말 이 게시글을 삭제하시겠습니까?");
        if (!confirmed) return;
        
        try {
            await deleteCommunity(f_id);
            showAlert("게시글이 삭제되었습니다.");
            navigate("/community"); 
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            showAlert("삭제 권한이 없거나 실패했습니다.");
        }
    };


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return

        try {
            const commentData = { fc_content: commentInput }
            const savedComment = await createComments(f_id, commentData)
            
            setComments((prev) => [...prev, savedComment])
            
            setCommentInput("")
            setIsInputOpen(false)
        } catch (error) {
            console.error("댓글 생성 실패:", error)
            showAlert("댓글 등록에 실패했습니다.")
        }
    }


    const handleEditClick=()=>{
        navigate(`/community/edit/${f_id}`)
    }

    if (!post) {
        return <div className="loading-container">게시글을 불러오는 중입니다... </div>
    }

    const isAuthor = user && post && user.u_id === post.u_id;

    return (
        <div className="community-detail-container">
            
            {/* 1. 맨 위: 글쓴이 + 제목 (한 줄), 날짜 (아래) / 수정, 삭제 (우측) */}
            <div className="detail-ig-header">
                <div className="ig-header-left">
                    <div className="ig-author-title-row">
                        <span className="ig-author">{post.user?.u_name || "익명"}</span>
                        <h2 className="ig-title-inline">{post.f_title}</h2>
                    </div>
                    <span className="ig-date">{new Date(post.f_created_at).toLocaleDateString()}</span>
                </div>
                <div className="ig-header-right">
                    {isAuthor && (
                        <>
                            <button className="ig-text-action-btn" onClick={handleEditClick}>수정</button>
                            <button className="ig-text-action-btn" onClick={handleDeleteClick}>삭제</button>
                        </>
                    )}
                </div>
            </div>

            {/* 2. 사진: 공백 없이 화면을 꽉 채움 */}
            {post.f_image && (
                <div className="detail-ig-image">
                    <img src={getImageUrl(post.f_image)} alt={post.f_title} />
                </div>
            )}

            {/* 3. 사진 바로 아래: 좋아요, 댓글 수, 태그 */}
            <div className="detail-ig-actions">
                <div className="ig-icons-box">
                    <button className={`ig-like-btn ${post.is_liked ? "liked" : ""}`} onClick={handleLikeClick}>
                        <span className="icon">{post.is_liked ? "❤️" : "🤍"}</span>
                        <span className="count">{post.f_like_count || 0}</span>
                    </button>
                    <div className="ig-comment-count">
                        <span className="icon">💬</span>
                        <span className="count">{comments.length}</span>
                    </div>
                </div>

                <div className="ig-tags-row">
                    {post.forum_tag?.ft_sleep && <span className="ig-tag">#수면</span>}
                    {post.forum_tag?.ft_food && <span className="ig-tag">#이유식</span>}
                    {post.forum_tag?.ft_health && <span className="ig-tag">#건강</span>}
                    {post.forum_tag?.ft_play && <span className="ig-tag">#놀이</span>}
                </div>
            </div>

            {/* 4. 그 아래: 본문 내용 */}
            <div className="detail-ig-content">
                <p className="ig-body-text">{post.f_content}</p>
            </div>

            <hr className="ig-divider" />

            {/* 5. 맨 아래: 댓글 목록 및 목록으로 버튼 */}
            <div className="detail-ig-comments">
                <div className="comment-header">
                    <span className="comment-count">댓글 {comments.length}</span>
                    <button className="comment-toggle-btn" onClick={() => setIsInputOpen(!isInputOpen)}>
                        {isInputOpen ? "작성 취소" : "댓글 작성"}
                    </button>
                </div>

                {isInputOpen && (
                    <div className="comment-input-area">
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                            <input 
                                className="comment-input"
                                type="text" 
                                placeholder="따뜻한 댓글을 남겨주세요..." 
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <button className="comment-submit-btn" type="submit">등록</button>
                        </form>
                    </div>
                )}

                <div className="comment-list">
                    {comments.length === 0 ? (
                        <p className="empty-comment">등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                    ) : (
                        <div className="comment-items">
                            {comments.map((c) => (
                                <CommentCard 
                                    key={c.fc_id} 
                                    comment={c} 
                                    currentUser={user}     
                                    postuserId={post.u_id}
                                    onDelete={(deleteId)=>setComments((prev) => prev.filter(item => item.fc_id !== deleteId))}
                                    onUpdate={(updatedId, updatedData) => setComments((prev) => prev.map(item => item.fc_id === updatedId ? updatedData : item))}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 목록으로 돌아가기 버튼을 댓글 목록 아래에 배치 */}
                <div className="ig-bottom-action">
                    <button className="ig-list-btn" onClick={() => navigate('/community')}>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default CommunityDetail;