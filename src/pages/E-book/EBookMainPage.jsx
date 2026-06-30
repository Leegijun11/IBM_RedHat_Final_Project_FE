import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook } from "../../services/ebook_api";
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
    const [selectedBabyId, setSelectedBabyId] = useState(null);
    const [babyAge, setBabyAge] = useState(0);
    const [tab, setTab] = useState("growth");

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const baby = await getCurrentBaby();

                if (!baby) {
                    alert("등록된 아기 정보가 없습니다.");
                    navigate("/babyinfo");
                    return;
                }

                setSelectedBabyId(baby.b_id);

                const birthDate = new Date(baby.b_birth);
                const today = new Date();

                let months =
                    (today.getFullYear() - birthDate.getFullYear()) * 12 +
                    (today.getMonth() - birthDate.getMonth());

                if (today.getDate() < birthDate.getDate()) {
                    months -= 1;
                }

                setBabyAge(Math.max(0, months));

                const result = await getEBook(baby.b_id);
                setBooks(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error(error);
                alert("정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchInitData();
    }, [navigate]);

    return (
        <div className="ebook-page">

            <div className="ebook-header">
                <h2>성장 디지털 북 📖</h2>

                <button
                    className="create-btn"
                    onClick={() => navigate("/ebook/create")}
                >
                    + 새 책 만들기
                </button>
            </div>

            <div className="book-list">
                {books.length === 0 ? (
                    <p className="empty-book">
                        생성된 디지털북이 없습니다.
                    </p>
                ) : (
                    books.map((book) => (
                        <BookCard
                            key={book.s_id}
                            book={book}
                            onDetailClick={() => setSelectedBook(book)}
                        />
                    ))
                )}
            </div>

            {selectedBook && (
                <BookDetail
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}

            <div className="ebook-tab">
                <button
                    className={tab === "growth" ? "active" : ""}
                    onClick={() => setTab("growth")}
                >
                    디지털 북
                </button>

                <button
                    className={tab === "compare" ? "active" : ""}
                    onClick={() => setTab("compare")}
                >
                    또래 비교
                </button>
            </div>

            {tab === "growth" ? (
                <>
                    <div className="content-card">
                        <h3>신체 성장 추이</h3>

                        {selectedBabyId && (
                            <GrowthChart b_id={selectedBabyId} />
                        )}
                    </div>

                    <div className="content-card">
                        {selectedBabyId && (
                            <MilestoneList
                                babyId={selectedBabyId}
                                babyAgeMonths={babyAge}
                            />
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="content-card">
                        <CompareChart />
                    </div>
                </>
            )}

            <div className="navi-wrapper">
                <NaviBar />
            </div>

        </div>
    );
}

export default EBookMainPage;