import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";
import { getRecord } from "../../services/record_api";
import { getBabyLogs } from "../../services/logs_api"; // 1. logs_api에서 getBabyLogs 추가 import


function calcStreak(logs) {
    if (!logs || logs.length === 0) return 0;

    const dateSet = new Set(
        logs.map((log) => new Date(log.l_date).toISOString().slice(0, 10))
    );

    let streak = 0;
    const cursor = new Date();

    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (dateSet.has(key)) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            // 어제 혹은 그 전날 기록이 없으면 루프를 멈춥니다.
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
                
                // 3. 두 가지 API를 개별적으로 호출합니다.
                const records = await getRecord(baby.b_id);
                const logs = await getBabyLogs(baby.b_id); // b_id에 해당하는 일상 로그 목록 조회

                // 4. 최근 키 / 최근 몸무게 반영 (records 테이블 기준)
                if (Array.isArray(records) && records.length > 0) {
                    const sortedRecords = [...records].sort(
                        (a, b) => new Date(a.r_date) - new Date(b.r_date)
                    );
                    const latestRecord = sortedRecords[sortedRecords.length - 1];

                    setHeight(latestRecord.r_height);
                    setWeight(latestRecord.r_weight);
                } else {
                    setHeight(null);
                    setWeight(null);
                }

                // 5. 연속 기록 일수 계산 (logs 테이블 기준)
                if (Array.isArray(logs) && logs.length > 0) {
                    setStreak(calcStreak(logs));
                } else {
                    setStreak(0);
                }

            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
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
                <h2 className="text-purple"style={streak > 0 ? {} : { fontSize: "14px", letterSpacing: "-0.5px", wordBreak: "keep-all" }}>
                    {streak > 0 ? `${streak}일 연속` : "오늘의 기록을 담아주세요"}
                </h2>
            </div>
        </div>
    );
}

export default Growth_card;