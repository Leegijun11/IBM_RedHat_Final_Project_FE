import React from "react";
import { getImageUrl } from "../../hooks/imageUrl";
import { updateComments, deleteComments } from "../../services/community_api";
import "../../styles/community_card.css"; // 지정하신 하위 styles 폴더 및 소문자 파일명 경로 준수

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
        <div className="community-card">
            {/* 1. 작성자 및 날짜 영역 */}
            <div className="card-meta">
                <span className="card-author">{post.user?.u_name || "익명"}</span>
                <span className="card-divider">|</span>
                <span className="card-date">{checkDate(post.f_created_at)}</span>
            </div>
            
            {/* 2. 게시글 제목 영역 */}
            <div className="card-content">
                <h3 className="card-title">{post.f_title}</h3>
                {/* <p className="card-text">{post.f_content}</p> */}
            </div>

            {/* 3. 태그 영역 */}
            <div className="card-tags">
                {post.forum_tag?.ft_sleep && <span className="card-tag">#수면</span>}
                {post.forum_tag?.ft_food && <span className="card-tag">#이유식</span>}
                {post.forum_tag?.ft_health && <span className="card-tag">#건강</span>}
                {post.forum_tag?.ft_play && <span className="card-tag">#놀이</span>}
            </div>
            
            {/* 4. 이미지 및 하단 액션 버튼 영역 */}
            <div className="card-footer">
                {post.f_image && (
                    <div className="card-image-wrapper">
                        <img src={getImageUrl(post.f_image)} alt={post.f_title} className="card-thumbnail" />
                    </div>
                )}
                
                <div className="card-actions">
                    <div className="card-stats">
                        {/* 둥근 박스 스타일이 적용된 좋아요 버튼 */}
                        <button className={`card-like-btn ${post.is_liked ? "liked" : ""}`} onClick={handleLikeClick}>
                            {post.is_liked ? "❤️" : "🤍"} {post.f_like_count || 0}
                        </button>
                        {/* 둥근 박스 스타일이 적용된 댓글 수 영역 */}
                        <span className="card-comment-count">💬 {post.comment_count || 0}</span>
                    </div>

                    <button className="card-detail-btn" onClick={onClick}>자세히 보기</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityCard;