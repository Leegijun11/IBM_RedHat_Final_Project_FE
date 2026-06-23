import { useState } from "react";

function Growth_card() {
    //임시 데이터
    const [height] = useState(65);
    const [weight] = useState(7.2);
    const [streak] = useState(23);

    return (
        <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>

            {/* 키 */}
            <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>

                <h3>키</h3>

                <h2>{height}cm</h2>
                <p>+2cm / 월</p>
        </div>

        {/* 몸무게 */}
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>

            <h3>몸무게</h3>

            <h2>{weight}kg</h2>

            <p>정상 범위</p>
        </div>

        {/* 연속 기록 */}
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>
            <h3>연속 기록</h3>

            <h2>{streak}일</h2>
            
            <p>달성 🎉</p>
        </div>
        </div>
    );
}

export default Growth_card;