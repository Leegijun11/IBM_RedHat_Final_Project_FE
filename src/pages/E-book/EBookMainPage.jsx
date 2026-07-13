import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook } from "../../services/ebook_api";
import { getMilestones } from "../../services/milestone_api";
import { getCurrentBaby } from "../../services/partner_api";
import GrowthChart from "../../components/EBook/Growth_chart";
import BookCard from "../../components/EBook/Book_card";
import BookDetail from "../../components/EBook/Book_detail";
import MilestoneList from "../../components/EBook/MilestoneList";
import CompareChart from "../../components/EBook/CompareChart";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookMainPage.css";

function EBookMainPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [baby, setBaby] = useState(null);          // ✅ 추가: 아이 전체 정보를 여기서만 보관
    const [babyAge, setBabyAge] = useState(0);
    const [tab, setTab] = useState("growth");

    const [totalMilestones, setTotalMilestones] = useState(0);
    const [achievedMilestones, setAchievedMilestones] = useState(0);

    const getTargetAge = (months) => {
        if (months < 2) return 2;
        if (months < 4) return 4;
        if (months < 6) return 6;
        if (months < 9) return 9;
        if (months < 12) return 12;
        if (months < 24) return 24;
        if (months < 36) return 36;
        if (months < 48) return 48;
        return 60;
    };

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const babyData = await getCurrentBaby();
                if (!babyData) {
                    alert("등록된 아기 정보가 없습니다.");
                    navigate("/babyinfo");
                    return;
                }

                setBaby(babyData);   // ✅ id뿐 아니라 전체 객체 저장

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

                try {
                    const targetAge = getTargetAge(finalAge);
                    const milestoneData = await getMilestones(babyData.b_id, targetAge, "");
                    if (Array.isArray(milestoneData)) {
                        setTotalMilestones(milestoneData.length);
                        setAchievedMilestones(milestoneData.filter(m => m.is_achieved).length);
                    }
                } catch { }

            } catch (error) {
                console.error(error);
                alert("정보를 불러오는 중 오류가 발생했습니다.");
            }
        };
        fetchInitData();
    }, [navigate]);

    const achievedPct = Math.min(Math.round((achievedMilestones / 8) * 100), 100);
    const canCreateBook = achievedMilestones >= 8 && achievedMilestones <= 16;

    return (
        <div className="ebook-page">
            <div className="ebook-header">
                <h2 className="ebook-title">성장 디지털 북 📖</h2>
            </div>

            <div className="milestone-gauge-card">
                <div className="gauge-header">
                    <span className="gauge-title">🌱 성장 마일스톤</span>
                    <span className="gauge-count">{achievedMilestones}개 달성</span>
                </div>
                <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: `${achievedPct}%` }} />
                </div>
                <p className="gauge-desc">
                    {canCreateBook
                        ? "✨ 디지털북을 만들 수 있어요!"
                        : achievedMilestones < 8
                        ? `📌 책 만들기까지 ${8 - achievedMilestones}개 더 달성해보세요`
                        : "📚 마일스톤을 충분히 달성했어요!"}
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
                    books.map((book) => (
                        <BookCard key={book.s_id} book={book} onDetailClick={() => setSelectedBook(book)} />
                    ))
                )}
            </div>

            {selectedBook && (
                <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
            )}

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