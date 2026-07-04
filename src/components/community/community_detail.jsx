import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getCommunityDetail,toggleCommunityLike,deleteCommunity, getComments, createComments,createCommentLike,deleteCommentLike } from "../../services/community_api";
import { getImageUrl } from "../../hooks/imageUrl";
import CommentCard from "../../components/Community/Comment_card"; 

const CommunityDetail = () => {

    const {f_id}=useParams()
    const navigate=useNavigate()
    const { user } = useAuth();
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
                alert("게시글을 불러올 수 없습니다.")
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
            alert("좋아요 처리 실패");
        }
    };


    const handleDeleteClick = async () => {
        if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
        
        try {
            await deleteCommunity(f_id);
            alert("게시글이 삭제되었습니다.");
            navigate("/community"); 
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            alert("삭제 권한이 없거나 실패했습니다.");
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
            alert("댓글 등록에 실패했습니다.")
        }
    }


    const handleEditClick=()=>{
        navigate(`/community/edit/${f_id}`)
    }

    if (!post) {
        return <div>게시글을 불러오는 중입니다... </div>
    }

    const isAuthor = user && post && user.u_id === post.u_id;

    return (
            <div>
                <h2>{post.f_title}</h2>
                {post.f_image && (<img src={getImageUrl(post.f_image)} alt={post.f_title} width="150"/>)}

                <div>
                    <span>작성자: {post.user?.u_name}</span>
                    <span>{new Date(post.f_created_at).toLocaleDateString()}</span>
                </div>

                <div><p>{post.f_content}</p></div>

                <div>
                    {post.forum_tag?.ft_sleep && <span>#수면 </span>}
                    {post.forum_tag?.ft_food && <span>#이유식 </span>}
                    {post.forum_tag?.ft_health && <span>#건강 </span>}
                    {post.forum_tag?.ft_play && <span>#놀이 </span>}
                </div>


                <div>
                    <button onClick={handleLikeClick}>
                        {post.is_liked ? "좋아요함" : "좋아요안함"}:{post.f_like_count || 0}
                    </button>

                    {isAuthor && (
                        <div>
                            <button onClick={handleEditClick}>수정</button>
                            <button onClick={handleDeleteClick}>삭제</button>
                        </div>
                    )}
                    <button onClick={() => navigate('/community')}>목록으로</button>
                </div>
                
                <hr />

                <div>
                    <span>댓글 {comments.length}</span>
                    
                    <button onClick={() => setIsInputOpen(!isInputOpen)}>
                        {isInputOpen ? "작성 취소" : "댓글 작성"}
                    </button>

                    {isInputOpen && (
                        <div>
                            <form onSubmit={handleCommentSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="댓글을 입력하세요" 
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                />
                                <button type="submit">등록하기</button>
                            </form>
                        </div>
                    )}
                </div>

                <div>
                    <h4>댓글 목록</h4>
                    {comments.length === 0 ? (
                        <p>등록된 댓글이 없습니다.</p>
                    ) : (
                        <div>
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

            </div>
        );
    };

export default CommunityDetail;