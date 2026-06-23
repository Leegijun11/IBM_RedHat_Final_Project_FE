import { useNavigate } from "react-router-dom";

function Baby_add() {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/babyinfo"); // Baby_form 페이지 경로에 맞춰 조정
  };

  return (
    <button type="button" onClick={handleAdd}>
      + 아이 추가
      <p>새로운 아이를 등록하세요</p>
    </button>
  );
}

export default Baby_add;