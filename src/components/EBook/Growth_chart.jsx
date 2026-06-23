import { useState, useEffect } from "react";
import { getRecord } from "../../services/record_api"; // API 함수 import

function Growth_chart({ b_id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // b_id가 있을 때만 API 호출
    if (!b_id) return;

    const fetchGrowth = async () => {
      try {
        // b_id를 파라미터로 전달
        const result = await getRecords({ b_id }); 
        setData(result);
      } catch (error) {
        console.error("성장 기록 불러오기 실패:", error);
      }
    };
    fetchGrowth();
  }, [b_id]); // b_id가 바뀔 때마다 다시 호출

  return (
    <div>
      {/* 데이터 활용하여 차트 렌더링 */}
      {data.length === 0 ? <p>데이터가 없습니다.</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default Growth_chart;