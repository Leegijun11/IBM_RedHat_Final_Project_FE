import { useNavigate } from "react-router-dom";

function Record_card() {
    const navigate = useNavigate();

    // 오늘의 기록 페이지 이동
    const handleMoveDiary = () => {
        navigate("/diary");
    };

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px", cursor: "pointer"}} onChange={handleMoveDiary}>

            <h2>오늘의 기록</h2>
            
            <p>오늘 있었던 일을 기록해보세요.</p>

            <button>기록하기</button>
        </div>
    );
}

export default Record_card;