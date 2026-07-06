import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import { getCurrentBaby } from "../../services/partner_api";
import { getBabyStandard } from "../../services/compare_api";
import { getDiaryList } from "../../services/diary_api";

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

import "../../styles/CompareChart.css";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function CompareChart() {
    const [standardData, setStandardData] = useState(null);
    const [babyInfo, setBabyInfo] = useState({ age: 0, gender: "M" });
    const [myStats, setMyStats] = useState({ height: 0, weight: 0, bmi: 0, sleep: 0, toilet: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                
                // 1. 아기 기본 정보 가져오기
                const baby = await getCurrentBaby();
                if (!baby) return;

                const bHeight = baby.b_height || 0;
                const bWeight = baby.b_weight || 0;
                let bBmi = 0;

                if (bHeight > 0 && bWeight > 0) {
                    const heightInMeters = bHeight / 100;
                    bBmi = parseFloat((bWeight / (heightInMeters * heightInMeters)).toFixed(2));
                }

                // 2. 오늘 날짜 구하기 (YYYY-MM-DD 형식)
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day = String(today.getDate()).padStart(2, "0");
                const todayStr = `${year}-${month}-${day}`;

                // 3. 오늘 자 작성된 일기 리스트 가져와서 수면 시간 & 배변 횟수 합산하기
                let totalSleep = 0;
                let totalToilet = 0;

                try {
                    const diaryList = await getDiaryList(baby.b_id, todayStr);
                    
                    if (diaryList && Array.isArray(diaryList)) {
                        diaryList.forEach((diary) => {
                            // [수면 시간 가공]
                            const sleepStr = diary.d_sleep;
                            if (sleepStr && sleepStr !== "없음") {
                                const sleepMatch = sleepStr.match(/[\d.]+/);
                                if (sleepMatch) totalSleep += parseFloat(sleepMatch[0]);
                            }

                            // [배변 횟수 가공]
                            const toiletStr = diary.d_toilet;
                            if (toiletStr && toiletStr !== "없음") {
                                const toiletMatch = toiletStr.match(/[\d.]+/);
                                if (toiletMatch) totalToilet += parseInt(toiletMatch[0], 10);
                            }
                        });
                    }
                } catch (diaryError) {
                    console.error("수면 및 배변 데이터 로드 실패:", diaryError);
                }

                // 내 스탯 통합 저장
                setMyStats({ 
                    height: bHeight, 
                    weight: bWeight, 
                    bmi: bBmi, 
                    sleep: totalSleep, 
                    toilet: totalToilet 
                });

                // 4. 월령 및 성별 계산 후 표준 데이터 가져오기
                const mappedGender = baby.b_gender === "여" ? "F" : "M";
                const birthDate = new Date(baby.b_birth);
                
                let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
                if (today.getDate() < birthDate.getDate()) {
                    months -= 1;
                }
                const finalAge = Math.max(0, months);

                setBabyInfo({ age: finalAge, gender: mappedGender });

                const standard = await getBabyStandard(mappedGender, finalAge);
                setStandardData(standard);

            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) return <div className="loading-box">데이터를 불러오는 중...</div>;
    if (!standardData) return <div className="error-box">표준 데이터를 찾을 수 없습니다.</div>;

    // 💡 [수정] 또래의 적정 평균값(중간값) 계산
    const peerSleepAvg = (standardData.sleep_min + standardData.sleep_max) / 2;
    const peerToiletAvg = ((standardData.toilet_min || 1) + (standardData.toilet_max || 3)) / 2;

    // 5각형 거미줄 균형을 맞추기 위한 최종 밸런스 스케일링 수식
    const peerData = [
        standardData.height,       // 키 기본폭 (예: 75)
        standardData.weight * 7,   // 몸무게 스케일 보정
        standardData.bmi * 4.5,    // BMI 스케일 보정
        peerSleepAvg * 6,          // 👈 [수정] 또래 최대값이 아닌 '평균 수면 시간' 반영
        peerToiletAvg * 25         // 👈 [수정] 또래 최대값이 아닌 '평균 배변 횟수' 반영
    ];

    const myChartData = [
        myStats.height,
        myStats.weight * 7,
        myStats.bmi * 4.5,
        myStats.sleep * 6,          // 내 아이의 실제 총 수면 시간 매핑
        myStats.toilet * 25         // 내 아이의 총 배변 횟수 매핑
    ];

    const chartData = {
        labels: ["키 (cm)", "몸무게 (kg)", "BMI 지수", "수면 시간", "배변 횟수"],
        datasets: [
            {
                label: "우리 아이",
                data: myChartData,
                backgroundColor: "rgba(240, 124, 96, 0.25)",
                borderColor: "#F07C60",
                borderWidth: 2,
                pointBackgroundColor: "#F07C60",
            },
            {
                label: "또래 평균", // 👈 라벨 이름도 직관적으로 변경
                data: peerData,
                backgroundColor: "rgba(163, 150, 140, 0.12)",
                borderColor: "#A3968C",
                borderWidth: 2,
                pointBackgroundColor: "#A3968C",
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { usePointStyle: true, padding: 10, font: { size: 11, weight: "600" } },
            },
        },
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 110,
                ticks: { display: false },
                grid: { color: "#F6EFEA" },
                angleLines: { color: "#F6EFEA" },
                pointLabels: {
                    color: "#5D5046",
                    font: { size: 12, weight: "800" },
                },
            },
        },
    };

    return (
        <div className="compare-chart-inside">
            <h3 className="compare-chart-main-title">
                📈 또래 대비 성장 지표 ({babyInfo.age}개월 / {babyInfo.gender === "F" ? "여아" : "남아"})
            </h3>
            
            <div className="radar-box">
                <Radar data={chartData} options={options} />
            </div>

            <div className="compare-divider" />

            <div className="compare-stat-rows">
                <div className="comp-row">
                    <span className="comp-lbl">신장 (키)</span>
                    <span className="comp-val">우리 아이 <strong>{myStats.height}cm</strong> / 또래 {standardData.height}cm</span>
                </div>
                <div className="comp-row">
                    <span className="comp-lbl">체중 (몸무게)</span>
                    <span className="comp-val">우리 아이 <strong>{myStats.weight}kg</strong> / 또래 {standardData.weight}kg</span>
                </div>
                <div className="comp-row">
                    <span className="comp-lbl">BMI 비만도</span>
                    <span className="comp-val">우리 아이 <strong>{myStats.bmi}</strong> / 또래 {standardData.bmi}</span>
                </div>
                <div className="comp-row">
                    <span className="comp-lbl">총 수면 시간</span>
                    <span className="comp-val">우리 아이 <strong>{myStats.sleep}시간</strong> / 권장 {standardData.sleep_min} ~ {standardData.sleep_max}시간</span>
                </div>
                <div className="comp-row">
                    <span className="comp-lbl">배변 횟수</span>
                    <span className="comp-val">우리 아이 <strong>{myStats.toilet}회</strong> / 또래 기준 {standardData.toilet_min || 1} ~ {standardData.toilet_max || 3}회</span>
                </div>
            </div>

            <p className="compare-footnote">
                ※ WHO 소아 발달 표준 마스터 가이드를 준수한 수치입니다.
            </p>
        </div>
    );
}

export default CompareChart;