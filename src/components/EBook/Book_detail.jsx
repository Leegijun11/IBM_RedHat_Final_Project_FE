import { useState, useEffect } from "react";
import { getEBookPagesList } from "../../services/ebook_api"; 
import SecureImage from "../common/SecureImage";
import "../../styles/Book_detail.css"; // 스타일 파일 연결

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
                                    
                                    {/* 📷 이미지 출력 영역 (인증된 요청으로 정제된 경로 조회) */}
                                    {page.sp_image && (
                                        <div className="page-img-wrapper" style={{ textAlign: "center", width: "100%", maxHeight: "280px", overflow: "hidden", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                                            <SecureImage
                                                path={page.sp_image}
                                                alt={`page-${page.sp_num}`}
                                                className="page-image"
                                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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