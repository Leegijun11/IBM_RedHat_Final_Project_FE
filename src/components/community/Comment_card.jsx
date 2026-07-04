import React, { useState } from 'react';
import { updateComments, deleteComments,createCommentLike, deleteCommentLike } from "../../services/community_api";

const CommentCard = ({ comment, currentUser, postuserId, onUpdate, onDelete }) => {
    

    const isCommentAuthor = currentUser && currentUser.u_id === comment.u_id;
    const isPostAuthor = comment.u_id === postuserId;
    const nickname = comment.user?.u_nickname || "알 수 없는 유저";

    const [isEditing, setIsEditing] = useState(false);

    const [editInput, setEditInput] = useState(comment.fc_content);
    const handleDelete = async () => {
        if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
        try {
            await deleteComments(comment.fc_id);
            onDelete(comment.fc_id); 
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다.");
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
            alert("댓글 수정에 실패했습니다.");
        }
    };

    //  댓글 좋아여
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
            alert("좋아요 처리 실패");
        }
    };
return (
        <div>
            <span>
                <strong>{nickname}</strong> 
                {isPostAuthor && <span>(글쓴이)</span>}
            </span>
            
            
            {isEditing ? (
                <form onSubmit={handleUpdateSubmit}>
                    <input 
                        type="text" 
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                    />
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => { setIsEditing(false); setEditInput(comment.fc_content); }}>
                        취소
                    </button>
                </form>
            ) : (
                <p>{comment.fc_content}</p>
            )}
            
            <button type="button" onClick={handleLikeClick}>
                {comment.is_liked ? "좋아요함" : "좋아요안함"} {comment.fc_like_count || 0}
            </button>

            {isCommentAuthor && !isEditing && (
                <div>
                    <button type="button" onClick={() => setIsEditing(true)}>수정</button>
                    <button type="button" onClick={handleDelete}>삭제</button>
                </div>
            )}
        </div>
    );
};

export default CommentCard;