import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBabyImages } from "../../services/babyimage_api"; 
import { getCurrentBaby } from "../../services/partner_api";
import "../../styles/Photo_Gallery.css"; // CSS 파일 경로 연결 완료

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Photo_Gallery() {
    const navigate=useNavigate()
    const [groupedPhotos, setGroupPhotos]=useState({})
    const [loading, setLoading]=useState(true)

    useEffect(() => {
        const fetchPhotos=async ()=>{
            try{
                const baby=await getCurrentBaby()
                if(!baby) return

                const photos=await getAllBabyImages(baby.b_id)

                const groups=photos.reduce((acc, photo)=>{
                    const dateString=photo.i_date ? photo.i_date.split('T')[0] : '날짜 없음'

                    if(!acc[dateString]){
                        acc[dateString]=[]
                    }
                    acc[dateString].push(photo)
                    return acc
                }, {})

                setGroupPhotos(groups)
            } catch (error){
                console.error("사진을 불러오지 못했습니다", error)
            } finally{
                setLoading(false)
            }
        }

        fetchPhotos()
    }, [])

    const getCleanImageUrl=(rawPath)=>{
        if(!rawPath) return ""
        const cleanPath=rawPath.replace(/\.\.\//g, '').replace(/^\/+/, '')
        return cleanPath.startsWith("http") ? cleanPath : `${BACKEND_URL}/${cleanPath}`
    }

    const formatDateString = (dateStr) => {
        if (dateStr === "날짜 없음") return dateStr
        const dateObj=new Date(dateStr)
        const month=dateObj.getMonth() + 1
        const day=dateObj.getDate()
        return `${month}월 ${day}일`
    };

    return (
        <div className="gallery-container">
            {/* 1. 갤러리 상단 헤더 (앱 네비게이션 바 스타일) */}
            <div className="gallery-header">
                <button className="gallery-back-btn" onClick={() => navigate("/home")}>
                    ‹ 홈
                </button>
                <h2>우리아이 사진첩</h2>
            </div>

            {/* 2. 메인 콘텐츠 영역 */}
            <div className="gallery-content">
                {loading ? (
                    <div className="gallery-empty-state">사진을 불러오는 중입니다...</div>
                ) : Object.keys(groupedPhotos).length === 0 ? (
                    <div className="gallery-empty-state">아직 등록된 사진이 없습니다</div>
                ) : (
                    <div className="gallery-list">
                        {Object.keys(groupedPhotos).sort((a, b) => new Date(b) - new Date(a)).map((date) => (
                            <div className="gallery-date-group" key={date}>
                                {/* 날짜 타이틀 */}
                                <h3 className="gallery-date-title">{formatDateString(date)}</h3>
                                
                                {/* 사진 격자형(Grid) 리스트 */}
                                <div className="gallery-grid">
                                    {groupedPhotos[date].map((photo) => (
                                        <div className="gallery-item" key={photo.i_id || photo.id}>
                                            <img className="gallery-img" src={getCleanImageUrl(photo.i_image)} alt="아기 사진" />
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