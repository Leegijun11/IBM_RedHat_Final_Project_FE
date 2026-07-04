import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth"; 
import { getCommunity, toggleCommunityLike } from "../../services/community_api";
import { getBabies } from "../../services/baby_api";
import CommunityCard from "../../components/Community/community_card"; 
import NaviBar from "../../components/common/NaviBar";

function CommunityPage() {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

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
                console.error("게시글 불러오기 오류:", error);
                setPosts([]);
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
                        alert("등록된 아기 정보가 없습니다. 마이페이지에서 아기를 먼저 등록해주세요.");
                    }
                } catch (error) {
                    console.error("아기 정보 조회 실패", error);
                    alert("아기 정보를 불러오는데 실패했습니다.");
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
            
            alert("좋아요 처리 실패: " + error.response?.data?.detail);
        }
    };

    return (
        <div>
            <div>
                <h2>육아 포럼</h2>
                <button onClick={() => navigate('/community/create')}>+ 새 게시물 쓰기</button>
            </div>

            <div>
                <button onClick={() => setSort("latest")}>최신순</button>
                <button onClick={() => setSort("likes")}>좋아요순</button>
            </div>

            <div>
                <button onClick={() => handleTagToggle("sleep")}>
                    수면 {activeTag === "sleep" ? "✅" : ""}
                </button>
                <button onClick={() => handleTagToggle("food")}>
                    이유식 {activeTag === "food" ? "✅" : ""}
                </button>
                <button onClick={() => handleTagToggle("health")}>
                    건강 {activeTag === "health" ? "✅" : ""}
                </button>
                <button onClick={() => handleTagToggle("play")}>
                    놀이 {activeTag === "play" ? "✅" : ""}
                </button>
            </div>

            <div>
                <button onClick={handleBabyCharacterToggle}>
                    {babyCharacter ? "전체 보기" : " 비슷한 기질"}
                </button>
            </div>

            <div>
                {posts.length === 0 ? (
                    <p>등록된 게시글이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <CommunityCard key={post.f_id} post={post} onClick={() => navigate(`/community/${post.f_id}`)} 
                        onLikeToggle={handleListLikeToggle}/>
                    ))
                )}
            </div>

            <div>
                <NaviBar />
            </div>
        </div>
    );
}

export default CommunityPage;