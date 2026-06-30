import { useState, useEffect } from "react";
import { getRecord } from "../../services/record_api";
import "../../styles/Growth_chart.css";

function Growth_chart({ b_id }) {
    const [data, setData] = useState([]);
    // 툴팁 상태 관리
    const [hoveredData, setHoveredData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchGrowth = async () => {
            if (!b_id) return;
            try {
                const result = await getRecord(b_id);
                setData(Array.isArray(result) ? result : []);
            } catch (error) { setData([]); }
        };
        fetchGrowth();
    }, [b_id]);

    const handleMouseEnter = (e, record) => {
        setHoveredData(record);
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const maxHeight = data.length > 0 ? Math.max(...data.map(d => Math.max(d.r_height, d.r_weight))) + 20 : 100;

    return (
        <div className="growth-chart-wrapper">
            <div className="bar-graph-container">
                {data.map((record) => (
                    <div key={record.r_id} className="graph-item">
                        <div 
                            className="bar-wrapper"
                            onMouseEnter={(e) => handleMouseEnter(e, record)}
                            onMouseLeave={() => setHoveredData(null)}
                        >
                            <div className="bar height-bar" style={{ height: `${(record.r_height / maxHeight) * 100}%` }} />
                            <div className="bar weight-bar" style={{ height: `${(record.r_weight / maxHeight) * 100}%` }} />
                        </div>
                        <span className="graph-date">{record.r_date.substring(5, 7)}월</span>
                    </div>
                ))}
            </div>

            {/* 툴팁 컴포넌트 */}
            {hoveredData && (
                <div className="chart-tooltip" style={{ left: tooltipPos.x + 10, top: tooltipPos.y - 60 }}>
                    <p className="tt-date">{hoveredData.r_date.substring(5, 7)}월</p>
                    <p className="tt-height">키 (cm) : {hoveredData.r_height}</p>
                    <p className="tt-weight">몸무게 (kg) : {hoveredData.r_weight}</p>
                </div>
            )}
        </div>
    );
}

export default Growth_chart;