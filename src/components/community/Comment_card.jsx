import React, { useState } from 'react';
import { updateComments, deleteComments,createCommentLike, deleteCommentLike } from "../../services/community_api";
import { useModal } from "../../hooks/useModal";
import "../../styles/Comment_card.css"; 

const CommentCard = ({ comment, currentUser, postuserId, onUpdate, onDelete }) => {
    
    const isCommentAuthor = currentUser && currentUser.u_id === comment.u_id;
    const isPostAuthor = comment.u_id === postuserId;
    const nickname = comment.user?.u_nickname || "알 수 없는 유저";

    const [isEditing, setIsEditing] = useState(false);
    const [editInput, setEditInput] = useState(comment.fc_content);
    const { showAlert, showConfirm } = useModal(); 

    const handleDelete = async () => {
        const confirmed = await showConfirm("정말 이 댓글을 삭제하시겠습니까?");
        if (!confirmed) return;
        try {
            await deleteComments(comment.fc_id);
            onDelete(comment.fc_id); 
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            showAlert("댓글 삭제에 실패했습니다.", "error");
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editInput.trim()) return;

        try {
            const commentData = { fc_content: editInput };
            const updatedComment = await updateComments(comment.fc_id, commentData);
            
            onUpdate(comment.fc_id, updatedComment); 
            setIsEditing(false); 
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            showAlert("댓글 수정에 실패했습니다.", "error");
        }
    };

    const handleLikeClick = async () => {
        try {
            if (comment.is_liked) {
                await deleteCommentLike(comment.fc_id);
            } else {
                await createCommentLike(comment.fc_id);
            }
            const updatedComment = {
                ...comment,
                is_liked: !comment.is_liked,
                fc_like_count: comment.is_liked ? comment.fc_like_count - 1 : comment.fc_like_count + 1
            };
            onUpdate(comment.fc_id, updatedComment);
        } catch (error) {
            showAlert("좋아요 처리 실패", "error");
        }
    };
    
    return (
        <div className="yt-style-comment-row">
            {/* 1. 좌측: 프로필 사진 (기본 회색 원형) */}
            <div className="yt-avatar-placeholder"></div>

            {/* 2. 중앙: 작성자 -> 내용 -> 수정/삭제 */}
            <div className="yt-comment-main">
                <div className="yt-comment-header">
                    <span className="yt-author-name">{nickname}</span>
                    {isPostAuthor && <span className="yt-author-badge">글쓴이</span>}
                </div>

                <div className="yt-comment-body">
                    {isEditing ? (
                        <form onSubmit={handleUpdateSubmit} className="yt-edit-form">
                            <input 
                                className="yt-edit-input"
                                type="text" 
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                            />
                            <div className="yt-edit-actions">
                                <button type="button" className="yt-edit-btn cancel" onClick={() => { setIsEditing(false); setEditInput(comment.fc_content); }}>
                                    취소
                                </button>
                                <button type="submit" className="yt-edit-btn save">
                                    저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {/* 내용 */}
                            <p className="yt-comment-text">{comment.fc_content}</p>
                            
                            {/* 내용 바로 아래 수정/삭제 */}
                            {isCommentAuthor && (
                                <div className="yt-meta-actions">
                                    <button type="button" className="yt-meta-btn" onClick={() => setIsEditing(true)}>수정</button>
                                    <button type="button" className="yt-meta-btn" onClick={handleDelete}>삭제</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {/* 3. 우측 끝: 좋아요 버튼 (수정 중이 아닐 때만 노출) */}
            {!isEditing && (
                <div className="yt-comment-right">
                    <button type="button" className={`yt-like-btn ${comment.is_liked ? "liked" : ""}`} onClick={handleLikeClick}>
                        <span className="yt-like-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={comment.is_liked ? "#F07C60" : "none"} stroke={comment.is_liked ? "#F07C60" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </span>
                        <span className="yt-like-count">{comment.fc_like_count || 0}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentCard;