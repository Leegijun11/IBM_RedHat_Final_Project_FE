import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEBook } from "../../services/ebook_api";
function EBookCreate() {
  const [period, setPeriod] = useState({ start: "", end: "" });
  const navigate = useNavigate();
  const handleCreate = async () => {
    try {
      await createEBook(period);  // 매개변수 뭘 받아야하지
      alert("디지털 북이 생성되었습니다.");
      navigate("ebook"); // 생성 후 목록으로 이동
    } catch (error) {
      alert("생성에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2>기간 선택하기</h2>
      {/* 여기에 달력 컴포넌트(날짜 선택 UI) 구현 */}
      <button onClick={handleCreate}>디지털 북 생성</button>
    </div>
  );
}

export default EBookCreate;