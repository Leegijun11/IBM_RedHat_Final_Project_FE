import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook, deleteEBook } from "../../services/ebook_api"; 
import { getAchievedCount } from "../../services/milestone_api";
import { getCurrentBaby } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";
import GrowthChart from "../../components/EBook/Growth_chart";
import BookCard from "../../components/EBook/Book_card";
import MilestoneList from "../../components/EBook/MilestoneList";
import CompareChart from "../../components/EBook/CompareChart";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookMainPage.css";

function EBookMainPage() {
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useModal(); 
    const [books, setBooks] = useState([]);
    const [baby, setBaby] = useState(null);
    const [babyAge, setBabyAge] = useState(0);
    const [tab, setTab] = useState("growth");
    const [currentPage, setCurrentPage] = useState(1);
    const BOOKS_PER_PAGE = 3;

    const [totalMilestones, setTotalMilestones] = useState(61);
    const [achievedMilestones, setAchievedMilestones] = useState(0);

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const babyData = await getCurrentBaby();
                if (!babyData) {
                    showAlert("등록된 아기 정보가 없습니다.", "error");
                    navigate("/babyinfo");
                    return;
                }

                setBaby(babyData);

                const birthDate = new Date(babyData.b_birth);
                const today = new Date();
                let months = (today.getFullYear() - birthDate.getFullYear()) * 12
                    + (today.getMonth() - birthDate.getMonth());
                if (today.getDate() < birthDate.getDate()) months -= 1;
                const finalAge = Math.max(0, months);
                setBabyAge(finalAge);

                try {
                    const result = await getEBook(babyData.b_id);
                    setBooks(Array.isArray(result) ? result : []);
                } catch { setBooks([]); }

                // 전체 달성 마일스톤 수 조회
                try {
                    const { count } = await getAchievedCount(babyData.b_id);
                    setAchievedMilestones(count);
                } catch { }

            } catch (error) {
                console.error(error);
                showAlert("정보를 불러오는 중 오류가 발생했습니다.", "error");
            }
        };
        fetchInitData();
    }, [navigate]);

    const handleDeleteBook = async (s_id) => {
        const confirmed = await showConfirm("이 디지털북을 정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await deleteEBook(s_id);
            showAlert("디지털북이 삭제되었습니다.");
            const nextBooks = books.filter(book => book.s_id !== s_id);
            setBooks(nextBooks);
            const nextTotalPages = Math.max(1, Math.ceil(nextBooks.length / BOOKS_PER_PAGE));
            if (currentPage > nextTotalPages) setCurrentPage(nextTotalPages);
        } catch (error) {
            console.error(error);
            showAlert("삭제에 실패했습니다.", "error");
        }
    };

    const REQUIRED_MILESTONE_COUNT = 5;
    const achievedPct = Math.min(Math.round((achievedMilestones / REQUIRED_MILESTONE_COUNT) * 100), 100);
    const canCreateBook = achievedMilestones >= REQUIRED_MILESTONE_COUNT;

    const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE));
    const pagedBooks = books.slice(
        (currentPage - 1) * BOOKS_PER_PAGE,
        currentPage * BOOKS_PER_PAGE
    );
    
    return (
        <div className="ebook-page page-container">
            <div className="ebook-header">
                <h2 className="ebook-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    성장 디지털 북
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                </h2>
            </div>

            <div className="milestone-gauge-card">
                <div className="gauge-header">
                    <span className="gauge-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#5EA37B" }}>
                            <path d="M12 22v-9"/>
                            <path d="M12 13C8 13 4 9 4 5c4 0 8 4 8 8z"/>
                            <path d="M12 13c4 0 8-4 8-8-4 0-8 4-8 8z"/>
                        </svg>
                        성장 마일스톤
                    </span>
                    <span className="gauge-count">{achievedMilestones}개 달성</span>
                </div>
                <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: `${achievedPct}%` }} />
                </div>
                
                <p className="gauge-desc">
                    {canCreateBook ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            </svg>
                            디지털북을 만들 수 있어요!
                        </span>
                    ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.67V6h-6v4.67a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                            </svg>
                            {`책 만들기까지 ${REQUIRED_MILESTONE_COUNT - achievedMilestones}개 더 달성해보세요`}
                        </span>
                    )}
                </p>
                
                {canCreateBook && (
                    <button className="gauge-create-btn" onClick={() => navigate("/ebook/create")}>
                        + 새 책 만들기
                    </button>
                )}
            </div>

            <div className="book-list">
                {books.length === 0 ? (
                    <p className="empty-book">생성된 디지털북이 없습니다.</p>
                ) : (
                    <>
                        {pagedBooks.map((book) => (
                            <BookCard
                                key={book.s_id}
                                book={book}
                                onDeleteClick={() => handleDeleteBook(book.s_id)}
                            />
                        ))}
                        {totalPages > 1 && (
                            <div className="book-pagination">
                                <button
                                    className="page-nav-btn"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    ‹
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                    <button
                                        key={num}
                                        className={`page-num-btn ${currentPage === num ? "active" : ""}`}
                                        onClick={() => setCurrentPage(num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    className="page-nav-btn"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="ebook-tab">
                <button className={tab === "growth" ? "active" : ""} onClick={() => setTab("growth")}>
                    디지털 북
                </button>
                <button className={tab === "compare" ? "active" : ""} onClick={() => setTab("compare")}>
                    또래 비교
                </button>
            </div>

            {tab === "growth" ? (
                <>
                    <div className="content-card">
                        <h3 className="card-title">신체 성장 추이</h3>
                        {baby && <GrowthChart baby={baby} />}
                    </div>
                    <div className="content-card">
                        {baby && <MilestoneList babyId={baby.b_id} babyAgeMonths={babyAge} />}
                    </div>
                </>
            ) : (
                <div className="content-card">
                    {baby && <CompareChart baby={baby} babyAge={babyAge} />}
                </div>
            )}

            <div className="navi-wrapper">
                <NaviBar />
            </div>
        </div>
    );
}

export default EBookMainPage;