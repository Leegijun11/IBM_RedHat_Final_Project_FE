import { useEffect, useState } from "react";
import { getTipList } from "../../services/tip_api";
import { getCurrentBaby } from "../../services/partner_api";

function Tip() {
  const [tipList, setTipList] = useState([]);
  const [babyMonth, setBabyMonth] = useState(null);

  const handleGetTipList = async () => {
    try {
      const baby = await getCurrentBaby();
      if (!baby) {
        setTipList([]);
        return;
      }

      const birthDate = new Date(baby.b_birth);
      const today = new Date;


      let months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());

      if (today.getDate() < birthDate.getDate()) {
        months -= 1;
      }

      setBabyMonth(months);

      const result = await getTipList(months);

      console.log("팁 목록 응답 :", result);

      if (Array.isArray(result)) {
        setTipList(result);
      } else {
        setTipList([]);
      }

    } catch (error) {
      console.log(error);
      setTipList([]);
    }
  };

  useEffect(() => {
    handleGetTipList();
  }, []);

  return (
    <div>
      <h2>AI 발달 팁</h2>

      {babyMonth !== null && <p>{babyMonth}개월 아가 기준</p>}

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