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
            <div className="tip-card-header-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="tip-icon-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F07C60" }}>
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        <path d="M5 3v4M3 5h4"/>
                    </svg>
                </div>
                <h2 className="tip-card-title" style={{ margin: 0 }}>성장 & 헬스 팁 · 오늘</h2>
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
                <p className="tip-card-content">해당 월령의 팁이 없습니다.</p>
            )}

        </div>
    );
}

export default Tip_card;