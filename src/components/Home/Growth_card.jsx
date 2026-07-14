import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";
import { getRecord } from "../../services/record_api";

// 오늘 날짜부터 거꾸로 훑으면서 기록이 있는 날이 며칠 연속되는지 계산합니다.
function calcStreak(records) {
    if (!records || records.length === 0) return 0;

    const dateSet = new Set(
        records.map((r) => new Date(r.r_date).toISOString().slice(0, 10))
    );

    let streak = 0;
    const cursor = new Date();

    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (dateSet.has(key)) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

function Growth_card() {
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                const records = await getRecord(baby.b_id);

                if (Array.isArray(records) && records.length > 0) {
                    const sorted = [...records].sort(
                        (a, b) => new Date(a.r_date) - new Date(b.r_date)
                    );
                    const latest = sorted[sorted.length - 1];

                    setHeight(latest.r_height);
                    setWeight(latest.r_weight);
                    setStreak(calcStreak(sorted));
                } else {
                    setHeight(null);
                    setWeight(null);
                    setStreak(0);
                }
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
                <h2 className="text-purple">{streak > 0 ? `${streak}일 연속` : "오늘의 기록을 담아주세요"}</h2>
            </div>
        </div>
    );
}

export default Growth_card;