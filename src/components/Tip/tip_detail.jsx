import { useEffect, useState } from "react";
import { getTipDetail } from "../../Services/tip_api";

function Tip_detail() {
    const [t_id, setT_id] = useState("");
    const [tip, setTip] = useState(null);

    // 팁 상세 조회
    const handleGetTipDetail = async () => {
        
        try {
            const result = await getTipDetail (t_id);

            console.log(result);

          setTip(result);  
        } catch (error) {
            console.log(error);

            alert("Tip 정보를 불러오는데 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>AI 발달 팁 상세</h2>

            <input type="number" placeholder="팁 ID" value={t_id} onChange={(e) => setT_id(e.target.value)} />

            <button onClick={handleGetTipDetail}>조회</button>

            {tip && (
                <div>
                    <h3>{tip.t_title}</h3>

                    <p>{tip.t_age}개월</p>

                    <p>{tip.t_content}</p>
                </div>
            )}
        </div>
    )
}

export default Tip_detail;