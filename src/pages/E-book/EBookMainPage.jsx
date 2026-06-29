import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook } from "../../services/ebook_api";
import { getCurrentBaby } from "../../services/partner_api"; // 변경: 공통 API 사용
import NaviBar from "../../components/common/NaviBar";
import BookCard from "../../components/EBook/Book_card";
import BookDetail from "../../components/EBook/Book_detail";
import GrowthChart from "../../components/EBook/Growth_chart";
import MilestoneList from "../../components/EBook/MilestoneList";

function EBookMainPage() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedBabyId, setSelectedBabyId] = useState(null);
    const [babyAge, setBabyAge] = useState(0); 
    const [tab, setTab] = useState("growth");

    // 아기 정보 및 책 목록 가져오기
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

                // 개월 수 계산 로직
                const birthDate = new Date(baby.b_birth);
                const today = new Date();
                let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                             (today.getMonth() - birthDate.getMonth());
                
                // 일자 차이 고려 (지난 달까지의 온전한 달 수)
                if (today.getDate() < birthDate.getDate()) {
                    months -= 1;
                }
                setBabyAge(Math.max(0, months));

                // 책 목록 조회
                const result = await getEBook(baby.b_id);
                setBooks(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                alert("정보를 불러오는 중 오류가 발생했습니다.");
            }
        };
        fetchInitData();
    }, [navigate]);

    return (
        <div>
            <h2>성장 디지털 북 📖</h2>
            <button onClick={() => navigate("/ebook/create")}>+ 새 책 만들기</button>

            <div>
                {books.length === 0 ? (<p>생성된 디지털북이 없습니다.</p>) : (
                    books.map((book) => (
                        <BookCard key={book.s_id} book={book} onDetailClick={() => setSelectedBook(book)} />
                    ))
                )}
            </div>

            {selectedBook && <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />}

            <hr />

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button onClick={() => setTab("growth")} style={{ backgroundColor: tab === "growth" ? "#ffffff" : "#eeeeee" }}>디지털 북</button>
                <button onClick={() => setTab("compare")} style={{ backgroundColor: tab === "compare" ? "#ffffff" : "#eeeeee" }}>또래 비교</button>
            </div>

            {tab === "growth" ? (
                <>
                    <h3>신체 성장 추이</h3>
                    {selectedBabyId && <GrowthChart b_id={selectedBabyId} />}
                    
                    <hr />
                    {/* 계산된 babyAge 전달 */}
                    {selectedBabyId !== null && <MilestoneList babyId={selectedBabyId} babyAgeMonths={babyAge} />}
                </>
            ) : (
                <>
                    <h3>또래 비교</h3>
                </>
            )}

            <NaviBar/>
        </div>
    );
}

export default EBookMainPage;