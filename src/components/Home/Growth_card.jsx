import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";
import { getLogStreak } from "../../services/logs_api";

function Growth_card() {
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                setHeight(baby.b_height);
                setWeight(baby.b_weight);

                //const streakResult = await getLogStreak(baby.b_id);
                //setStreak(streakResult.streak);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>

            {/* 키 */}
            <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>
                <h3>키</h3>
                <h2>{height !== null ? `${height}cm` : "-"}</h2>
            </div>

            {/* 몸무게 */}
            <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>
                <h3>몸무게</h3>
                <h2>{weight !== null ? `${weight}kg` : "-"}</h2>
            </div>

            {/* 연속 기록 */}
            <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", flex: 1}}>
                <h3>연속 기록</h3>
                <h2>{streak}일</h2>
                {streak > 0 && <p>달성 🎉</p>}
            </div>
        </div>
    );
}

export default Growth_card;