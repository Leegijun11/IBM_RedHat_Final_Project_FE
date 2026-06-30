import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTipList } from "../../services/tip_api";
import { getCurrentBaby } from "../../services/partner_api";

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
                let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
                if (today.getDate() < birthDate.getDate()) { months -= 1; }
                setBabyMonth(months);

                const tips = await getTipList(months);

                if (tips && tips.length > 0) {
                    setTip(tips[0]);
                } else {
                    setTip(null);
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
    }

    return (
        <div className="home-card-base">
            <div className="tip-card-header-wrap">
                <div className="tip-icon-badge">✨</div>
                <h2 className="tip-card-title">AI 발달 팁 · 오늘</h2>
                <span className="tip-card-month-badge">
                    {babyMonth !== null ? `${babyMonth}개월` : ""}
                </span>
            </div>

            {tip ? (
                <>
                    <h3 className="tip-card-content" style={{ marginBottom: "4px" }}>{tip.t_title}</h3>
                    <p className="tip-card-content">{tip.t_content}</p>
                </>
            ) : (
                <p className="tip-card-content">해당 월령의 발달 팁이 없습니다.</p>
            )}

            <button className="tip-card-link-btn" onClick={handleMore}>더 알아보기 <span>＞</span></button>
        </div>
    );
}

export default Tip_card;
