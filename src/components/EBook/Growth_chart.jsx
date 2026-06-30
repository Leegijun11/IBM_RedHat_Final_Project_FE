import { useState, useEffect } from "react";
import { getRecord } from "../../services/record_api";
import "../../styles/Growth_chart.css";


function Growth_chart({ b_id }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!b_id) return;

        const fetchGrowth = async () => {
            try {
                const result = await getRecord(b_id);

                if (Array.isArray(result)) {
                    setData(result);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error("성장 기록 불러오기 실패:", error);
                setData([]);
            }
        };

        fetchGrowth();
    }, [b_id]);

    if (data.length === 0) {
        return <p className="growth-empty">데이터가 없습니다.</p>;
    }

    return (
        <div className="growth-card">

            <div className="growth-table-wrapper"></div>

            <table className="growth-table">

                {/* 추가 : 컬럼 너비 동일하게 */}
                <colgroup>
                    <col style={{ width: "33.33%" }} />
                    <col style={{ width: "33.33%" }} />
                    <col style={{ width: "33.33%" }} />
                </colgroup>

                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>키(cm)</th>
                        <th>몸무게(kg)</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((record) => (
                        <tr key={record.r_id}>
                            <td>{record.r_date.substring(0, 10)}</td>
                            <td>{record.r_height}</td>
                            <td>{record.r_weight}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default Growth_chart;