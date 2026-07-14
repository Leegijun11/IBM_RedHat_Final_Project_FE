import { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import { getBabyStandard } from "../../services/compare_api";
import { getDiaryList } from "../../services/diary_api";

import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, } from "chart.js";
import "../../styles/CompareChart.css";

ChartJS.register( RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend );

function CompareChart({ baby, babyAge }) {  // ✅ 부모가 이미 가진 데이터를 재사용
    const [standardData, setStandardData] = useState(null);

    const [babyInfo, setBabyInfo] = useState({
        age: 0,
        gender: "M",
    });

    const [myStats, setMyStats] = useState({
        height: 0,
        weight: 0,
        bmi: 0,
        sleep: 0,
        toilet: 0,
    });

    const [loading, setLoading] = useState(true);

    const mappedGender = baby?.b_gender === "여" ? "F" : "M";

    useEffect(() => {
        const fetchAllData = async () => {
            if (!baby) return;
            try {
                setLoading(true);

                const baby = await getCurrentBaby();

                if (!baby) return;

                const bHeight = baby.b_height || 0;
                const bWeight = baby.b_weight || 0;

                let bBmi = 0;
                if (bHeight > 0 && bWeight > 0) {
                    const heightInMeters = bHeight / 100;

                    bBmi = parseFloat(
                        (
                            bWeight /
                            (heightInMeters * heightInMeters)
                        ).toFixed(2)
                    );
                }

                const today = new Date();

                const year = today.getFullYear();

                const month = String(
                    today.getMonth() + 1
                ).padStart(2, "0");

                const day = String(
                    today.getDate()
                ).padStart(2, "0");

                const todayStr = `${year}-${month}-${day}`;

                let totalSleep = 0;
                let totalToilet = 0;

                try {
                    const diaryList = await getDiaryList(
                        baby.b_id,
                        todayStr
                    );

                    if (
                        diaryList &&
                        Array.isArray(diaryList)
                    ) {
                        diaryList.forEach((diary) => {
                            const sleepStr = diary.d_sleep;
                            if (sleepStr && sleepStr !== "없음") {
                                const sleepMatch = sleepStr.match(/[\d.]+/);
                                if (sleepMatch) totalSleep += parseFloat(sleepMatch[0]);
                            }

                            const toiletStr = diary.d_toilet;

                            if (
                                toiletStr &&
                                toiletStr !== "없음"
                            ) {
                                const toiletMatch =
                                    toiletStr.match(/[\d.]+/);

                                if (toiletMatch) {
                                    totalToilet += parseInt(
                                        toiletMatch[0],
                                        10
                                    );
                                }
                            }
                        });
                    }
                } catch (diaryError) {
                    console.error(
                        "수면 및 배변 데이터 로드 실패:",
                        diaryError
                    );
                }

                setMyStats({ height: bHeight, weight: bWeight, bmi: bBmi, sleep: totalSleep, toilet: totalToilet, });

                const mappedGender =
                    baby.b_gender === "여"
                        ? "F"
                        : "M";

                const birthDate = new Date(baby.b_birth);

                let months =
                    (
                        today.getFullYear() -
                        birthDate.getFullYear()
                    ) * 12 +
                    (
                        today.getMonth() -
                        birthDate.getMonth()
                    );

                if (
                    today.getDate() <
                    birthDate.getDate()
                ) {
                    months -= 1;
                }

                const finalAge = Math.max(0, months);

                setBabyInfo({
                    age: finalAge,
                    gender: mappedGender,
                });

                const standard = await getBabyStandard(
                    mappedGender,
                    finalAge
                );

                setStandardData(standard);

            } catch (error) {
                console.error(
                    "데이터 로드 실패:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [baby, babyAge, mappedGender]);


    if (loading) {
        return (
            <div className="loading-box">
                데이터를 불러오는 중...
            </div>
        );
    }


    if (!standardData) {
        return (
            <div className="error-box">
                표준 데이터를 찾을 수 없습니다.
            </div>
        );
    }


    // ==============================
    // 기존 그래프 계산 로직
    // ==============================

    const normalize = (myVal, peerVal) => {
        if (!peerVal || peerVal === 0) {
            return 0;
        }

        return Math.round(
            (myVal / peerVal) * 100
        );
    };


    const peerSleepAvg =
        (
            standardData.sleep_min +
            standardData.sleep_max
        ) / 2;


    const peerToiletAvg =
        (
            (standardData.toilet_min || 1) +
            (standardData.toilet_max || 3)
        ) / 2;


    const peerData = [ 100, 100, 100, 100, 100, ];


    const myChartData = [
        normalize(
            myStats.height,
            standardData.height
        ),

        normalize(
            myStats.weight,
            standardData.weight
        ),

        normalize(
            myStats.bmi,
            standardData.bmi
        ),

        normalize(
            myStats.sleep,
            peerSleepAvg
        ),

        normalize(
            myStats.toilet,
            peerToiletAvg
        ),
    ];


    const chartData = {
        labels: [
            "키 (cm)",
            "몸무게 (kg)",
            "BMI 지수",
            "수면 시간",
            "배변 횟수",
        ],

        datasets: [
            {
                label: "우리 아이",
                data: myChartData,

                backgroundColor:
                    "rgba(240, 124, 96, 0.25)",

                borderColor: "#F07C60",

                borderWidth: 2,

                pointBackgroundColor: "#F07C60",
            },

            {
                label: "또래 평균",
                data: peerData,

                backgroundColor:
                    "rgba(163, 150, 140, 0.12)",

                borderColor: "#A3968C",

                borderWidth: 2,

                pointBackgroundColor: "#A3968C",
            },
        ],
    };


    const options = {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "bottom",

                labels: {
                    usePointStyle: true,
                    padding: 10,

                    font: {
                        size: 11,
                        weight: "600",
                    },
                },
            },

            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label =
                            context.dataset.label || "";

                        const value = context.raw;

                        if (label === "또래 평균") {
                            return `${label}: 100% (기준)`;
                        }

                        return `${label}: ${value}%`;
                    },
                },
            },
        },

        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 150,

                ticks: {
                    display: false,
                },

                grid: {
                    color: "#F6EFEA",
                },

                angleLines: {
                    color: "#F6EFEA",
                },

                pointLabels: {
                    color: "#5D5046",

                    font: {
                        size: 12,
                        weight: "800",
                    },
                },
            },
        },
    };


    // ==============================
    // 상세 비교 문구
    // ==============================

    const getHeightDifferenceText = () => {
        const difference =
            myStats.height -
            standardData.height;

        if (Math.abs(difference) < 0.01) {
            return "또래 평균과 비슷해요";
        }

        if (difference > 0) {
            return `또래 평균보다 ${difference.toFixed(2)}cm 커요`;
        }

        return `또래 평균보다 ${Math.abs(difference).toFixed(2)}cm 작아요`;
    };


    // 체중 차이 숫자의 불필요한 0 제거
    // 1.00 -> 1
    // 1.50 -> 1.5
    // 1.27 -> 1.27

    const getWeightDifferenceText = () => {
        const difference =
            myStats.weight -
            standardData.weight;

        const formattedDifference = Number(
            Math.abs(difference).toFixed(2)
        );

        if (Math.abs(difference) < 0.01) {
            return "또래 평균과 비슷해요";
        }

        if (difference > 0) {
            return `또래 평균보다 ${formattedDifference}kg 무거워요`;
        }

        return `또래 평균보다 ${formattedDifference}kg 가벼워요`;
    };


    const getBmiDifferenceText = () => {
        const difference =
            myStats.bmi -
            standardData.bmi;

        if (Math.abs(difference) < 0.01) {
            return "또래 평균과 비슷해요";
        }

        if (difference > 0) {
            return `또래 평균보다 ${difference.toFixed(2)} 높아요`;
        }

        return `또래 평균보다 ${Math.abs(difference).toFixed(2)} 낮아요`;
    };


    const getSleepDifferenceText = () => {
        if (myStats.sleep === 0) {
            return "수면 기록이 없어요";
        }

        if (
            myStats.sleep <
            standardData.sleep_min
        ) {
            const difference =
                standardData.sleep_min -
                myStats.sleep;

            return `권장 시간보다 ${difference.toFixed(1)}시간 부족해요`;
        }

        if (
            myStats.sleep >
            standardData.sleep_max
        ) {
            const difference =
                myStats.sleep -
                standardData.sleep_max;

            return `권장 시간보다 ${difference.toFixed(1)}시간 많아요`;
        }

        return "권장 수면 시간 범위에 있어요";
    };


    const getToiletDifferenceText = () => {
        const toiletMin =
            standardData.toilet_min || 1;

        const toiletMax =
            standardData.toilet_max || 3;

        if (myStats.toilet === 0) {
            return "배변 기록이 없어요";
        }

        if (myStats.toilet < toiletMin) {
            return `또래 기준보다 ${ toiletMin - myStats.toilet }회 적어요`;
        }

        if (myStats.toilet > toiletMax) {
            return `또래 기준보다 ${ myStats.toilet - toiletMax }회 많아요`;
        }

        return "또래 기준 범위에 있어요";
    };


    return (
        <div className="compare-chart-inside">

            <h3 className="compare-chart-main-title">
                📈 또래 대비 성장 지표
                ({babyInfo.age}개월 /
                {babyInfo.gender === "F"
                    ? "여아"
                    : "남아"})
            </h3>



            <div className="radar-box">
                <Radar
                    data={chartData}
                    options={options}
                />
            </div>


            <div className="compare-divider" />


            <div className="compare-stat-rows">

                <div className="comp-row">
                    <span className="comp-lbl">
                        신장 (키)
                    </span>

                    <span className="comp-val">
                        우리 아이{" "}

                        <strong>
                            {Number(myStats.height).toFixed(2)}cm
                        </strong>

                        {" / "}

                        또래 평균{" "}

                        {Number(standardData.height).toFixed(2)}cm

                        <span className="comp-badge">
                            {getHeightDifferenceText()}
                        </span>
                    </span>
                </div>


                <div className="comp-row">
                    <span className="comp-lbl">
                        체중 (몸무게)
                    </span>

                    <span className="comp-val">
                        우리 아이{" "}

                        <strong>
                            {Number(myStats.weight).toFixed(2)}kg
                        </strong>

                        {" / "}

                        또래 평균{" "}

                        {Number(standardData.weight).toFixed(2)}kg

                        <span className="comp-badge">
                            {getWeightDifferenceText()}
                        </span>
                    </span>
                </div>


                <div className="comp-row">
                    <span className="comp-lbl">
                        BMI 비만도
                    </span>

                    <span className="comp-val">
                        우리 아이{" "}

                        <strong>
                            {Number(myStats.bmi).toFixed(2)}
                        </strong>

                        {" / "}

                        또래 평균{" "}

                        {Number(standardData.bmi).toFixed(2)}

                        <span className="comp-badge">
                            {getBmiDifferenceText()}
                        </span>
                    </span>
                </div>


                <div className="comp-row">
                    <span className="comp-lbl">
                        총 수면 시간
                    </span>

                    <span className="comp-val">
                        우리 아이{" "}

                        <strong>
                            {myStats.sleep}시간
                        </strong>

                        {" / "}

                        권장{" "}

                        {standardData.sleep_min}
                        ~
                        {standardData.sleep_max}
                        시간

                        <span className="comp-badge">
                            {getSleepDifferenceText()}
                        </span>
                    </span>
                </div>


                <div className="comp-row">
                    <span className="comp-lbl">
                        배변 횟수
                    </span>

                    <span className="comp-val">
                        우리 아이{" "}

                        <strong>
                            {myStats.toilet}회
                        </strong>

                        {" / "}

                        또래 기준{" "}

                        {standardData.toilet_min || 1}
                        ~
                        {standardData.toilet_max || 3}
                        회

                        <span className="comp-badge">
                            {getToiletDifferenceText()}
                        </span>
                    </span>
                </div>

            </div>


            <p className="compare-footnote">
                ※ WHO 소아 발달 표준 마스터 가이드를 준수한 수치입니다.
            </p>

        </div>
    );
}

export default CompareChart;