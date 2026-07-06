import { useState, useEffect } from "react";
import { getEBookPagesList } from "../../services/ebook_api"; 
import "../../styles/Book_detail.css"; // 스타일 파일 연결

// ★ 백엔드 호스트 주소 설정 (일기 상세 조회와 동일)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_detail({ book, onClose }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookPages = async () => {
            try {
                setLoading(true);
                const data = await getEBookPagesList(book.s_id);
                
                // 페이지 번호(sp_num) 순서대로 정렬해서 상태에 저장
                const sortedPages = Array.isArray(data) 
                    ? data.sort((a, b) => a.sp_num - b.sp_num) 
                    : [];
                setPages(sortedPages);
            } catch (error) {
                console.error("디지털북 페이지를 불러오는 중 오류 발생:", error);
                setPages([]);
            } finally {
                setLoading(false);
            }
        };

        if (book?.s_id) {
            fetchBookPages();
        }
    }, [book]);

    // 📷 이미지 URL 정제 헬퍼 함수
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;

        // 윈도우 절대 경로 백슬래시 처리 및 가공
        let cleanPath = imagePath.replace(/\\/g, "/");

        // 만약 DB에 "C:/Users/.../backend/images/..." 와 같이 풀 경로로 저장되어 있다면 정제
        if (cleanPath.includes("/images/")) {
            cleanPath = "images/" + cleanPath.split("/images/")[1];
        }

        return `${BACKEND_URL}/${cleanPath}`;
    };

    return (
        <div className="book-detail-overlay">
            <div className="book-detail-container">
                <h2 className="detail-title">{book.s_name}</h2>
                <hr className="detail-divider" />

                <div className="detail-content-wrapper">
                    {loading ? (
                        <p className="loading-text">페이지를 불러오는 중입니다...</p>
                    ) : pages.length === 0 ? (
                        <p className="empty-text">생성된 동화책 페이지가 없습니다.</p>
                    ) : (
                        <div className="book-pages-list">
                            {pages.map((page) => (
                                <div key={page.sp_id} className="book-page-item" style={{ marginBottom: "30px" }}>
                                    
                                    {/* 📷 이미지 출력 영역 (정제된 URL 결합형식 반영) */}
                                    {page.sp_image && (
                                        <div className="page-img-wrapper" style={{ textAlign: "center", width: "100%", maxHeight: "280px", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                                            <img 
                                                src={getImageUrl(page.sp_image)} 
                                                alt={`page-${page.sp_num}`} 
                                                className="page-image" 
                                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                onError={(e) => {
                                                    console.error("이미지 로드 실패 주소:", e.target.src);
                                                }}
                                            />
                                        </div>
                                    )}

                                    <p className="detail-content" style={{ marginTop: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                                        {page.sp_content}
                                    </p>
                                    <div className="page-number" style={{ textAlign: "center", color: "#888", fontSize: "14px", marginTop: "10px" }}>
                                        {page.sp_num} 페이지
                                    </div>
                                    <hr style={{ border: "0", borderTop: "1px dashed #eee", margin: "20px 0" }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="close-btn" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}

export default Book_detail;