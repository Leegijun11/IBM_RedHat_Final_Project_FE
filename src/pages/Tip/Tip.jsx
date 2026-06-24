import { useEffect, useState } from "react";
import { getTipList } from "../../Services/tip_api";

function Tip() {
  const [tipList, setTipList] = useState([]);

  // 나중에 아기 정보 API에서 받아올 값
  const b_age = 2;

  const handleGetTipList = async () => {
    try {
      const result = await getTipList(b_age);

      console.log("팁 목록 응답 :", result);

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
            <p>대상 나이 : {tip.t_age}개월</p>
            <p>{tip.t_content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Tip;