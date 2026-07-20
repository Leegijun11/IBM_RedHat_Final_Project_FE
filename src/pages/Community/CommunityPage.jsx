import React, { useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth"; 
import { useNavigate } from 'react-router-dom';
import { getCommunity, toggleCommunityLike } from "../../services/community_api";
import { getBabies } from "../../services/baby_api";
import { useModal } from "../../hooks/useModal";
import CommunityCard from "../../components/community/community_card"; 
import NaviBar from "../../components/common/NaviBar";
import "../../styles/CommunityPage.css"; // 지정하신 styles 폴더 경로 유지

function CommunityPage() {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const { showAlert } = useModal(); 
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState("latest");
    const [activeTag, setActiveTag] = useState("");
    const [babyCharacter, setBabyCharacter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeBabyId, setActiveBabyId] = useState(null); 
    const [isFilteringByBaby, setIsFilteringByBaby] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;
        const storedBabyId = localStorage.getItem("activeBabyId");
        
        if (storedBabyId) {
            setActiveBabyId(Number(storedBabyId)); 
        } else {
            setActiveBabyId(null);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) return;

            try {
                setPosts([]);
                const sortParam = sort === "likes" ? "likes" : "latest";
                const tagParam = activeTag === "" ? null : activeTag;
                
                const charParam = babyCharacter === "my_baby" ? "my_baby" : null;
                const bIdParam = babyCharacter === "my_baby" ? activeBabyId : null;
                
                const result = await getCommunity(
                    1, 10, "", sortParam, tagParam, charParam, bIdParam
                );

                setPosts(Array.isArray(result) ? result : []);
            } catch (error) {
                if(error.response && error.response.status === 400){
                    const errorMessage = error.response.data.detail;
                    showAlert(errorMessage, "error");

                    setBabyCharacter(""); 
                }
            }
        };

        fetchData();
    }, [sort, activeTag, babyCharacter, isLoggedIn, activeBabyId]);

    const handleTagToggle = (tagValue) => {
        if (activeTag === tagValue) {
            setActiveTag(""); 
        } else {
            setActiveTag(tagValue);
        }
    };

    const handleBabyCharacterToggle = async () => {
        if (babyCharacter) {
            setBabyCharacter(""); 
        } else {
            if (!activeBabyId) {
                try {
                    const babies = await getBabies();
                    if (babies && babies.length > 0) {
                        const firstBabyId = babies[0].b_id;
                        setActiveBabyId(firstBabyId);
                        localStorage.setItem("activeBabyId", firstBabyId);
                        setBabyCharacter("my_baby");
                    } else {
                        showAlert("등록된 아기 정보가 없습니다. 마이페이지에서 아기를 먼저 등록해주세요.", "error");
                    }
                } catch (error) {
                    console.error("아기 정보 조회 실패", error);
                    showAlert("아기 정보를 불러오는데 실패했습니다.", "error");
                }
            } else {
                setBabyCharacter("my_baby");
            }
        }
    };

    const handleListLikeToggle = async (targetId, isLiked) => {
        try {
            await toggleCommunityLike(targetId, isLiked);
            
            setPosts((prevPosts) => 
                prevPosts.map((post) => 
                    post.f_id === targetId 
                        ? { 
                            ...post, 
                            is_liked: !post.is_liked, 
                            f_like_count: post.is_liked ? post.f_like_count - 1 : post.f_like_count + 1 
                        }
                        : post
                )
            );
        } catch (error) {
            if (error.response?.data?.detail === "이미 좋아요를 누른 게시글") {
                setPosts((prevPosts) => 
                    prevPosts.map((post) => 
                        post.f_id === targetId ? { ...post, is_liked: true } : post
                    )
                );
                return; 
            }
            
            showAlert("좋아요 처리 실패: " + error.response?.data?.detail, "error");
        }
    };

    return (
        <div className="community-page-container">
            {/* 1. 페이지 타이틀 */}
            <div className="community-title-area">
                <h2>육아 포럼 💬</h2>
            </div>
            {/* 2. 태그 및 기질 분류 (상단 배치 & 가로 스크롤 통합) */}
            <div className="community-tags-scroll">
                <button className={`tag-btn ${activeTag === "sleep" ? "active" : ""}`} onClick={() => handleTagToggle("sleep")}>
                    수면 {activeTag === "sleep" ? "✅" : ""}
                </button>
                <button className={`tag-btn ${activeTag === "food" ? "active" : ""}`} onClick={() => handleTagToggle("food")}>
                    이유식 {activeTag === "food" ? "✅" : ""}
                </button>
                <button className={`tag-btn ${activeTag === "health" ? "active" : ""}`} onClick={() => handleTagToggle("health")}>
                    건강 {activeTag === "health" ? "✅" : ""}
                </button>
                <button className={`tag-btn ${activeTag === "play" ? "active" : ""}`} onClick={() => handleTagToggle("play")}>
                    놀이 {activeTag === "play" ? "✅" : ""}
                </button>
                {/* 네가 수정한 기질 버튼 부분 적용 완료 */}
                <button className={`filter-btn ${babyCharacter ? "active" : ""}`} onClick={handleBabyCharacterToggle}>
                    {babyCharacter ? "비슷한 기질 ✅" : "비슷한 기질"}
                </button>
            </div>

            {/* 3. 새 게시물 쓰기 */}
            <div className="community-create-section">
                <button className="create-post-btn" onClick={() => navigate('/community/create')}>
                    <span className="create-placeholder">오늘의 육아 이야기를 나눠보세요...</span>
                    <div className="create-icon-circle">+</div>
                </button>
            </div>

            {/* 4. 정렬 버튼 */}
            <div className="community-sort-group">
                <button 
                    className={`sort-btn ${sort === "latest" ? "active" : ""}`} 
                    onClick={() => setSort("latest")}
                >
                    최신순
                </button>
                <button 
                    className={`sort-btn ${sort === "likes" ? "active" : ""}`} 
                    onClick={() => setSort("likes")}
                >
                    좋아요순
                </button>
            </div>

            {/* 5. 게시글 리스트 영역 */}
            <div className="community-post-list">
                {posts.length === 0 ? (
                    <p className="empty-message">등록된 게시글이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <CommunityCard 
                            key={post.f_id} 
                            post={post} 
                            onClick={() => navigate(`/community/${post.f_id}`)} 
                            onLikeToggle={handleListLikeToggle}
                        />
                    ))
                )}
            </div>

            {/* 6. 하단 네비게이션 */}
            <div className="bottom-nav-container">
                <NaviBar />
            </div>
        </div>
    );
}

export default CommunityPage;