import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tip_card() {
    const navigate = useNavigate();

    //임시 데이터 추후 변경
    const [babyMonth] = useState(5);

    const tips = {
        3: "목을 가누기 시작하는 시기예요. 다양한 소리를 들려주새세요.",
        5: "옹알이가 활발해지는 시기예요. 눈을 맞추며 많이 이야기해주세요.",
        8: "기기 시작하는 시기예요. 안전란 놀이 공간을 만들어주세요.",
        12: "첫 걸음을 연습하는 시기예요. 칭찬을 많이해주세요.",
    };

    const currentTip = tips[babyMonth] || "아가의 성장에 맞는 발달 팁을 준비 중입니다.";

    const handleMore = () => {

        // AI 발달 팁 페이지 추후 연결

        navigate("/tips");
    };

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20ox", marginBottom: "20px"}}>

            <h2>AI 발달 팁</h2>

            <h3>{babyMonth}개월 아가</h3>

            <p>{currentTip}</p>

            <button onClick={handleMore}>더 알아보기</button>
        </div>
    );
}

export default Tip_card;
