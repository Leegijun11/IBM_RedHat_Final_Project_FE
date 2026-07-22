import { useState, useEffect } from "react";
import { getEBookPagesList } from "../../services/ebook_api"; 
import SecureImage from "../common/SecureImage";
import "../../styles/Book_detail.css"; 

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_detail({ book, onClose }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 🌟 상세 모달에도 완벽하게 테마 번호(1~8)를 추출해서 주입
    const getThemeNum = (coverString) => {
        if (!coverString || coverString === "없음") return "1";
        const match = coverString.match(/fcover(\d+)/);
        return match ? match[1] : "1";
    };
    
    const themeNum = getThemeNum(book?.s_fcover);

    useEffect(() => {
        const fetchBookPages = async () => {
            try {
                setLoading(true);
                const data = await getEBookPagesList(book.s_id);
                
                const sortedPages = Array.isArray(data) 
                    ? data.sort((a, b) => a.sp_num - b.sp_num) 
                    : [];
                
                const combinedPages = [];

                if (book.s_fcover && book.s_fcover !== "없음") {
                    combinedPages.push({ isCover: true, sp_image: book.s_fcover });
                }

                combinedPages.push(...sortedPages);

                if (book.s_bcover && book.s_bcover !== "없음") {
                    combinedPages.push({ isCover: true, sp_image: book.s_bcover });
                }

                setPages(combinedPages);
                setCurrentIndex(0);
            } catch (error) {
                console.error("디지털북 페이지를 불러오는 중 오류 발생:", error);
                setPages([]);
            } finally {
                setLoading(false);
            }
        };

        if (book?.s_id) fetchBookPages();
    }, [book]);

    const handlePrevPage = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
    const handleNextPage = () => setCurrentIndex((prev) => Math.min(pages.length - 1, prev + 1));

    const currentPage = pages[currentIndex];

    return (
        <div className="book-detail-overlay">
            {/* 🌟 껍데기에 theme-1 ~ theme-8 부여 */}
            <div className={`book-detail-container theme-${themeNum}`}>
                <h2 className="detail-title">{book.s_name}</h2>
                <hr className="detail-divider" />

                <div className="detail-content-wrapper">
                    {loading ? (
                        <p className="loading-text">페이지를 불러오는 중입니다...</p>
                    ) : pages.length === 0 ? (
                        <p className="empty-text">생성된 동화책 페이지가 없습니다.</p>
                    ) : (
                        <div className="book-page-viewer">
                            <button
                                type="button"
                                className="page-nav-arrow left"
                                onClick={handlePrevPage}
                                disabled={currentIndex === 0}
                            >
                                ‹
                            </button>

                            <div className="book-page-item">
                                {currentPage.sp_image && (
                                    <div className="page-img-wrapper">
                                        {currentPage.isCover ? (
                                            <img
                                                src={`${BACKEND_URL}/${currentPage.sp_image}`}
                                                alt="표지"
                                                className="page-image"
                                            />
                                        ) : (
                                            <SecureImage
                                                path={currentPage.sp_image}
                                                alt={`page-${currentPage.sp_num}`}
                                                className="page-image"
                                            />
                                        )}
                                    </div>
                                )}

                                <p className="detail-content">
                                    {currentPage.sp_content}
                                </p>

                                <div className="page-number">
                                    {currentPage.isCover 
                                        ? (currentIndex === 0 ? "앞표지" : "뒷표지") 
                                        : `${currentIndex + 1} / ${pages.length} 페이지`
                                    }
                                </div>
                            </div>

                            <button
                                type="button"
                                className="page-nav-arrow right"
                                onClick={handleNextPage}
                                disabled={currentIndex === pages.length - 1}
                            >
                                ›
                            </button>
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