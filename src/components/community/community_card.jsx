import React from "react";
import { getImageUrl } from "../../hooks/imageUrl";
import { updateComments, deleteComments } from "../../services/community_api";
function CommunityCard({ post, onClick, onLikeToggle }) {
    
    const checkDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };

    const handleLikeClick = (e) => {
        e.stopPropagation()
        onLikeToggle(post.f_id, post.is_liked)
    }

    return (
        <div>
            <div>
                <span>{post.user?.u_name || "익명"} | </span>
                <span>{checkDate(post.f_created_at)}</span>
            </div>
            
            <div>
                <h3>{post.f_title}</h3>
                {/* <p>{post.f_content}</p> */}
            </div>

            <div>
                {post.forum_tag?.ft_sleep && <span>#수면</span>}
                {post.forum_tag?.ft_food && <span>#이유식</span>}
                {post.forum_tag?.ft_health && <span>#건강</span>}
                {post.forum_tag?.ft_play && <span>#놀이</span>}
            </div>
            
            <div>
                {post.f_image && (<img src={getImageUrl(post.f_image)} alt={post.f_title} width="150"/>)}
                <button onClick={handleLikeClick}>
                    {post.is_liked ? "좋아요함" : "좋아요안함"} {post.f_like_count || 0}
                </button>
                <span>댓글 수: {post.comment_count || 0}</span>

                <button onClick={onClick}>자세히 보기</button>
            </div>
        </div>
    );
}

export default CommunityCard;