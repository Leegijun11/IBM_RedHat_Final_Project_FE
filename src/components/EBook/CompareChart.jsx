import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import { getCurrentBaby } from "../../services/partner_api";
import { getBabyStandard } from "../../services/compare_api";
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
    const [myStats, setMyStats] = useState({ height: 0, weight: 0, bmi: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const baby = await getCurrentBaby();
                if (!baby) return;

                const bHeight = baby.b_height || 0;
                const bWeight = baby.b_weight || 0;
                let bBmi = 0;

                if (bHeight > 0 && bWeight > 0) {
                    const heightInMeters = bHeight / 100;
                    bBmi = parseFloat((bWeight / (heightInMeters * heightInMeters)).toFixed(2));
                }

                setMyStats({ height: bHeight, weight: bWeight, bmi: bBmi });

                const mappedGender = baby.b_gender === "여" ? "F" : "M";
                const birthDate = new Date(baby.b_birth);
                const today = new Date();
                
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

    // 거미줄 균형을 맞추기 위한 최종 밸런스 스케일링 수식
    const peerData = [
        standardData.height,       // 키 기본폭 (예: 75)
        standardData.weight * 7,   // 몸무게 스케일 보정 (예: 9.5 * 7 = 66.5)
        standardData.bmi * 4.5,    // BMI 스케일 보정 (예: 16.5 * 4.5 = 74.25)
        standardData.sleep_max * 6 // 수면 스케일 보정 (예: 13 * 6 = 78)
    ];

    const myChartData = [
        myStats.height,
        myStats.weight * 7,
        myStats.bmi * 4.5,
        standardData.sleep_min * 6 // 내 아이 라벨링 데이터 매핑선
    ];

    const chartData = {
        labels: ["키 (cm)", "몸무게 (kg)", "BMI 지수", "수면 시간"],
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
                label: "또래 표준",
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
                    <span className="comp-lbl">권장 수면</span>
                    <span className="comp-val"><strong>{standardData.sleep_min} ~ {standardData.sleep_max}시간</strong></span>
                </div>
            </div>

            <p className="compare-footnote">
                ※ WHO 소아 발달 표준 마스터 가이드를 준수한 수치입니다.
            </p>
        </div>
    );
}

export default CompareChart;