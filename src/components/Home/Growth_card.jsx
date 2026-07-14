import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";

function Growth_card() {
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [streak, setStreak] = useState(0); // 추후 기록 수나 연속 일수를 백엔드 연동 가능

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                setHeight(baby.b_height);
                setWeight(baby.b_weight);
                // 만약 백엔드에서 streak 일수를 제공한다면 이곳에서 setStreak(baby.streak) 등으로 설정 가능합니다.
            } catch (error) {
                console.error("가져오기 실패:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="growth-grid-wrap">
            <div className="growth-item-box bg-orange">
                <h3 className="text-orange">최근 키</h3>
                <h2 className="text-orange">{height !== null ? `${height}cm` : "-"}</h2>
            </div>

            <div className="growth-item-box bg-green">
                <h3 className="text-green">최근 몸무게</h3>
                <h2 className="text-green">{weight !== null ? `${weight}kg` : "-"}</h2>
            </div>

            <div className="growth-item-box bg-purple">
                <h3 className="text-purple">기록 상태</h3>
                <h2 className="text-purple">{streak > 0 ? `${streak}일 연속` : "오늘도 기록완료!"}</h2>
                <p className="text-sub-purple">성장 메이트 🎉</p>
            </div>
        </div>
    );
}

export default Growth_card;