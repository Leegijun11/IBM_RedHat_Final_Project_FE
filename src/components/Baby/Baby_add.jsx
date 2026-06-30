import { useNavigate } from "react-router-dom";
import "../../styles/Baby_add.css"; // 🔥 스타일 파일 연결

function Baby_add() {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/babyinfo"); // Baby_form 페이지 경로에 맞춰 조정
  };

  return (
    <button type="button" className="baby-add-btn" onClick={handleAdd}>
      <div className="baby-add-icon">+</div>
      <div className="baby-add-text">
        <span className="baby-add-title">아이 추가</span>
        <span className="baby-add-subtitle">새로운 아이를 등록하세요</span>
      </div>
    </button>
  );
}

export default Baby_add;