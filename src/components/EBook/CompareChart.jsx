import {
    Radar
} from "react-chartjs-2";

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

// Chart.js 등록
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

function CompareChart() {

    // 추후 API 연결 예정
    const myData = [90, 75, 82, 88, 70];
    const peerData = [70, 70, 70, 70, 70];

    const chartData = {
        labels: [
            "호기심",
            "집중력",
            "사회성",
            "활동성",
            "창의성",
        ],

        datasets: [
            {
                label: "우리 아이",
                data: myData,
                backgroundColor: "rgba(232,130,90,0.25)",
                borderColor: "#E8825A",
                borderWidth: 2,
                pointBackgroundColor: "#E8825A",
            },

            {
                label: "또래 평균",
                data: peerData,
                backgroundColor: "rgba(180,180,180,0.15)",
                borderColor: "#B9B9B9",
                borderWidth: 2,
                pointBackgroundColor: "#B9B9B9",
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

                    padding: 20,

                },

            },

        },

        scales: {

            r: {

                suggestedMin: 0,

                suggestedMax: 100,

                ticks: {

                    stepSize: 20,

                    backdropColor: "transparent",

                },

                grid: {

                    color: "#ECECEC",

                },

                angleLines: {

                    color: "#ECECEC",

                },

                pointLabels: {

                    color: "#444",

                    font: {

                        size: 13,

                        weight: "600",

                    },

                },

            },

        },

    };

    return (

        <div className="compare-page">

            {/* 레이더 차트 */}

            <div className="compare-card">

                <h3>또래 비교</h3>

                <div className="radar-box">

                    <Radar
                        data={chartData}
                        options={options}
                    />

                </div>

            </div>

            {/* AI 분석 */}

            <div className="compare-card">

                <h3>AI 기질 분석</h3>

                <div className="trait-list">

                    <div className="trait-item">

                        <div className="trait-header">

                            <span>호기심</span>

                            <span>90점</span>

                        </div>

                        <div className="trait-bar">

                            <div
                                className="trait-fill"
                                style={{ width: "90%" }}
                            />
                        </div>

                    </div>

                    <div className="trait-item">

                        <div className="trait-header">

                            <span>집중력</span>

                            <span>88점</span>

                        </div>

                        <div className="trait-bar">

                            <div
                                className="trait-fill"
                                style={{ width: "88%" }}
                            />

                        </div>

                    </div>

                    <div className="trait-item">

                        <div className="trait-header">

                            <span>사회성</span>

                            <span>82점</span>

                        </div>

                        <div className="trait-bar">

                            <div
                                className="trait-fill"
                                style={{ width: "82%" }}
                            />

                        </div>

                    </div>

                    <div className="trait-item">

                        <div className="trait-header">

                            <span>활동성</span>

                            <span>75점</span>

                        </div>

                        <div className="trait-bar">

                            <div
                                className="trait-fill"
                                style={{ width: "75%" }}
                            />

                        </div>

                    </div>

                </div>

                <div className="compare-comment">

                    우리 아이는 또래보다
                    <strong> 호기심과 집중력</strong>이
                    높은 편입니다.

                    <br /><br />

                    다양한 놀이와 새로운 경험을
                    제공하면 더욱 긍정적인
                    성장을 기대할 수 있습니다.

                </div>

            </div>

        </div>

    );

}

export default CompareChart;