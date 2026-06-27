import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook } from "../../services/ebook_api";
import { getBabies } from "../../services/baby_api";

import BookCard from "../../components/EBook/Book_card";
import BookDetail from "../../components/EBook/Book_detail";
import GrowthChart from "../../components/EBook/Growth_chart";
//import CompareChart from "../../components/EBook/Compare_chart";

function EBookMainPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    const [selectedBabyId, setSelectedBabyId] = useState(null);

    // 탭 상태
    const [tab, setTab] = useState("growth");

    // 디지털북 목록 조회
    const fetchBooks = async (b_id) => {
        try {
            const result = await getEBook(b_id);
            setBooks(Array.isArray(result) ? result : []);
        } catch (error) {
            console.log(error);
            setBooks([]);
            alert("디지털북 목록을 불러오는데 실패했습니다.");
        }
    };

    // 아기 정보 조회
    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const babies = await getBabies();

                if (!babies || babies.length === 0) {
                    alert("등록된 아기 정보가 없습니다.");
                    navigate("/babyinfo");
                    return;
                }

                const babyId = babies[0].b_id;

                setSelectedBabyId(babyId);
                fetchBooks(babyId);

            } catch (error) {
                console.log(error);
                alert("로그인이 필요합니다.");
                navigate("/");
            }
        };

        fetchBaby();
    }, []);

    return (
        <div>
            <h2>성장 디지털 북 📖</h2>

            <button onClick={() => navigate("/ebook/create")}>
                + 새 책 만들기
            </button>

            <div>
                {books.length === 0 ? (
                    <p>생성된 디지털북이 없습니다.</p>
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

            <hr />

            {/* 탭 */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >
                <button
                    onClick={() => setTab("growth")}
                    style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor:
                            tab === "growth" ? "#ffffff" : "#eeeeee"
                    }}
                >
                    디지털 북
                </button>

                <button
                    onClick={() => setTab("compare")}
                    style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor:
                            tab === "compare" ? "#ffffff" : "#eeeeee"
                    }}
                >
                    또래 비교
                </button>
            </div>

            {tab === "growth" ? (
                <>
                    <h3>신체 성장 추이</h3>

                    {selectedBabyId && (
                        <GrowthChart b_id={selectedBabyId} />
                    )}
                </>
            ) : (
                <>
                    <h3>또래 비교</h3>

                    {/* {selectedBabyId && (
                        <CompareChart b_id={selectedBabyId} />
                    )} */}
                </>
            )}
        </div>
    );
}

export default EBookMainPage;