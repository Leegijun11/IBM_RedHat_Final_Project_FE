import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEBookDetail, getEBookPagesList } from "../../services/ebook_api";
import SecureImage from "../common/SecureImage";
import "../../styles/Book_detail.css";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Book_detail() {
    const { s_id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const match = book?.s_fcover ? book.s_fcover.match(/fcover(\d+)/) : null;
    const themeNum = match ? match[1] : '1';

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);

                const [bookData, pageData] = await Promise.all([
                    getEBookDetail(s_id),
                    getEBookPagesList(s_id),
                ]);

                setBook(bookData);

                const sortedPages = Array.isArray(pageData)
                    ? pageData.sort((a, b) => a.sp_num - b.sp_num)
                    : [];

                const combinedPages = [];

                if (bookData?.s_fcover && bookData.s_fcover !== "없음") {
                    combinedPages.push({ isCover: true, sp_image: bookData.s_fcover });
                }
                combinedPages.push(...sortedPages);
                if (bookData?.s_bcover && bookData.s_bcover !== "없음") {
                    combinedPages.push({ isCover: true, sp_image: bookData.s_bcover });
                }

                setPages(combinedPages);
                setCurrentIndex(0);
            } catch (error) {
                console.error("디지털북 정보를 불러오는 중 오류 발생:", error);
                setBook(null);
                setPages([]);
            } finally {
                setLoading(false);
            }
        };

        if (s_id) fetchBook();
    }, [s_id]);

    const handlePrevPage = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
    const handleNextPage = () => setCurrentIndex((prev) => Math.min(pages.length - 1, prev + 1));
    const currentPage = pages[currentIndex];

    if (loading) {
        return (
            <div className="book-detail-page page-container">
                <p className="loading-text">페이지를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="book-detail-page page-container">
                <p className="empty-text">동화책을 찾을 수 없습니다.</p>
                <button className="close-btn" onClick={() => navigate(-1)}>돌아가기</button>
            </div>
        );
    }

    return (
        <div className={`book-detail-page page-container theme-${themeNum}`}>
            <div className="book-detail-container">
                <h2 className="detail-title">{book.s_name}</h2>
                <hr className="detail-divider" />

                <div className="detail-content-wrapper">
                    {pages.length === 0 ? (
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

                            <div className={`book-page-item ${currentPage?.isCover ? "is-cover" : ""}`}>
                                {currentPage?.isCover ? (
                                    <div className="page-img-wrapper is-cover-wrapper">
                                        <img
                                            src={`${BACKEND_URL}/${currentPage.sp_image}`}
                                            alt="표지"
                                            className="page-image is-cover-img"
                                        />
                                    </div>
                                ) : (
                                    <div className="page-img-wrapper polaroid-frame">
                                        {currentPage?.sp_image ? (
                                            <div className="polaroid-image-container">
                                                <SecureImage
                                                    path={currentPage.sp_image}
                                                    alt={`page-${currentPage.sp_num}`}
                                                    className="polaroid-image"
                                                />
                                            </div>
                                        ) : (
                                            <div className="polaroid-empty">
                                                <svg className="polaroid-empty-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!currentPage.isCover && (
                                    <p className="detail-content">{currentPage.sp_content}</p>
                                )}

                                {!currentPage.isCover && (
                                    <div className="page-number">
                                        {`${currentIndex + 1} / ${pages.length} 페이지`}
                                    </div>
                                )}
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

                <button className="close-btn" onClick={() => navigate(-1)}>닫기</button>
            </div>
        </div>
    );
}

export default Book_detail;