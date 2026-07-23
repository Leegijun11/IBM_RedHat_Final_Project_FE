import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMonthlyBabyImages } from "../../services/babyimage_api"; 
import { getCurrentBaby } from "../../services/partner_api";
import SecureGrowthImage from "../common/Securegrowthimage"
import "../../styles/Photo_Gallery.css"; // CSS 파일 경로 연결 완료

function Photo_Gallery() {
    const navigate = useNavigate();
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [monthlyPhotos, setMonthlyPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        const fetchMonthlyPhotos = async () => {
            setLoading(true);
            try {
                const baby = await getCurrentBaby();
                if (!baby) return;

                const photos = await getMonthlyBabyImages(baby.b_id, year, month);
                setMonthlyPhotos(photos); 
            } catch (error) {
                console.error("사진을 불러오지 못했습니다", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyPhotos();
    }, [year, month]); 

    const groupedPhotos = monthlyPhotos.reduce((acc, photo) => {
        const dateString = photo.i_date ? photo.i_date.split('T')[0] : '날짜 없음';
        if (!acc[dateString]) {
            acc[dateString] = [];
        }
        acc[dateString].push(photo);
        return acc;
    }, {});

    const handlePrevMonth = () => {
        if (month === 1) {
            setYear(year - 1);
            setMonth(12);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    };

    const formatDateString = (dateStr) => {
        if (dateStr === "날짜 없음") return dateStr;
        const dateObj = new Date(dateStr);
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        return `${m}월 ${d}일`;
    };

    return (
        <div className="photo-gallery-container">
            {/* 1. 헤더 영역 */}
            <div className="gallery-header">
                <button className="back-btn" onClick={() => navigate("/home")}>
                    ← 홈
                </button>
                <h2 className="gallery-title">우리아이 사진첩 📸</h2>
            </div>

            {/* 2. 월 이동 네비게이터 */}
            <div className="month-navigator">
                <button className="month-nav-btn" onClick={handlePrevMonth}>&lt;</button>
                <span className="month-label">
                    {year}년 {month}월
                </span>
                <button className="month-nav-btn" onClick={handleNextMonth}>&gt;</button>
            </div>

            {/* 3. 사진 갤러리 영역 */}
            <div className="gallery-content">
                {loading ? (
                    <div className="status-message">사진을 불러오는 중입니다...</div>
                ) : monthlyPhotos.length === 0 ? (
                    <div className="status-message empty">이 달에는 등록된 사진이 없습니다.</div>
                ) : (
                    <div className="gallery-list">
                        {Object.keys(groupedPhotos)
                            .sort((a, b) => new Date(b) - new Date(a))
                            .map((date) => (
                                <div className="date-group" key={date}>
                                    <h4 className="date-label">{formatDateString(date)}</h4>
                                    
                                    {/* 3열 사진 그리드 */}
                                    <div className="photo-grid">
                                        {groupedPhotos[date].map((photo) => (
                                            <div className="photo-item" key={photo.i_id || photo.id}>
                                                {/* ★ 변경 포인트: i_id 기반 인증된 요청으로 사진 표시 */}
                                                <SecureGrowthImage
                                                    i_id={photo.i_id}
                                                    alt="아기 사진"
                                                    className="photo-img"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Photo_Gallery;