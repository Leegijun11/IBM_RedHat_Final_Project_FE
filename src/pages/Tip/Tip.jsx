import { useEffect, useState } from "react";
import { getTipList } from "../../Services/tip_api";

function Tip() {
    const [tipList, setTipList] = useState([]);

    // 팁 목록 조회
    const handleGetTipList = async () => {
        try {
            const result = await getTipList();

            console.log(result);

            if (Array.isArray(result)) {
                setTipList(result);
            } else {
                setTipList([]);
            }
        } catch (error) {
            console.log(error);

            alert("Tip 정보들을 불러오는데 실패하였습니다.");
        }
    };

    useEffect(() => {
        handleGetTipList();
    }, []);

    return (
        <div>
            <h2>AI 발달 팁</h2>

            {tipList.length === 0 ? (
                <p>등록된 Tip이 없습니다.</p>
            ) : (
                tipList.map((tip) => (
                    <div key={tip.t_id}>
                        <h3>{tip.t_title}</h3>

                        <p>{tip.t_age}개월</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Tip;