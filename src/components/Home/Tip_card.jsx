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
                const birthDate = new Date(baby.b_birth);
                const today = new Date();
                let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
                if (today.getDate() < birthDate.getDate()) { months -= 1; }
                setBabyMonth(months);

                const tips = await getTipList(months);
                if (tips && tips.length > 0) { setTip(tips[0]); }
            } catch (error) {
                console.log(error);
                setTip(null);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-card-base">
            <div className="tip-card-header-wrap">
                <div className="tip-icon-badge">✨</div>
                <h2 className="tip-card-title">AI 발달 팁 · 오늘</h2>
                <span className="tip-card-month-badge">{babyMonth !== null ? `${babyMonth}개월` : "-개"}</span>
            </div>
            <p className="tip-card-content">{tip ? tip.t_content : "아가의 성장에 맞는 발달 팁을 준비 중입니다."}</p>
            <button className="tip-card-link-btn" onClick={() => navigate("/tips")}>더 알아보기 <span>＞</span></button>
        </div>
    );
}

export default Tip_card;