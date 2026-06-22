import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEBook } from "../../services/ebook_api";
import { getCurrentUser } from "../../services/user_api"; // 유저 및 아기 조회용
import BookCard from "../../components/EBook/Book_card";
import BookDetail from "../../components/EBook/Book_detail";
import GrowthChart from "../../components/EBook/Growth_chart";
import useAuth from "../../hooks/useAuth";

function EBookMainPage() {
  const navigate = useNavigate();
  const { my_id } = useAuth();
  
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // 아기 관련 상태 추가
  const [selectedBabyId, setSelectedBabyId] = useState(null);

  // 1. 유저 정보(아기 목록 포함) 및 EBook 목록 동시 조회
  const fetchData = async (uid) => {
    try {
      const userResult = await getCurrentUser(uid);
      const bookResult = await getEBook(uid);
      
      setBooks(bookResult || []);
      
      // 아기 정보가 있으면 첫 번째 아기 선택
      if (userResult.baby && userResult.baby.length > 0) {
        setSelectedBabyId(userResult.baby[0].b_id);
      }
    } catch (error) {
      console.error(error);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (my_id) fetchData(my_id);
  }, [my_id]);

  return (
    <div>
      <h2>성장 디지털 북 📖</h2>
      <button onClick={() => navigate("create")}>+ 새 책 만들기</button>

      {/* 디지털 북 리스트 */}
      <div>
        {books.map((book) => (
          <BookCard 
            key={book.b_id} 
            book={book} 
            onDetailClick={() => setSelectedBook(book)} 
          />
        ))}
      </div>

      {selectedBook && (
        <BookDetail 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}

      <hr />
      <h3>신체 성장 추이</h3>
      {/* 선택된 아기 ID를 차트로 전달 */}
      {selectedBabyId && <GrowthChart b_id={selectedBabyId} />}
    </div>
  );
}

export default EBookMainPage;