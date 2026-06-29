import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTipList } from "../../services/tip_api";
import { getCurrentBaby } from "../../services/partner_api";
import { getBabies } from "../../services/baby_api";

function Tip_card() {
    const navigate = useNavigate();
    const [babyMonth, setBabyMonth] = useState(null);
    const [tip, setTip] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                console.log("현재 아이 =", baby);
                const birthDate = new Date(baby.b_birth);
                const today = new Date();

                let months =
                    (today.getFullYear() - birthDate.getFullYear()) * 12 +
                    (today.getMonth() - birthDate.getMonth());

                if (today.getDate() < birthDate.getDate()) {
                    months -= 1;
                }

                setBabyMonth(months);

                const tips = await getTipList(months);
                if (tips && tips.length > 0) {
                    setTip(tips[0]);
                }
            } catch (error) {
                console.log(error);
                setTip(null);
            }
        };

        fetchData();
    }, []);

    const handleMore = () => {
        navigate("/tips");
    };

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>

            <h2>AI 발달 팁</h2>

            <h3>{babyMonth !== null ? `${babyMonth}개월 아가` : "월령 정보 없음"}</h3>

            <p>{tip ? tip.t_content : "아가의 성장에 맞는 발달 팁을 준비 중입니다."}</p>

            <button onClick={handleMore}>더 알아보기</button>
        </div>
    );
}

export default Tip_card;