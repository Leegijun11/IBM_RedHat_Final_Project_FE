import { useEffect, useState } from "react";
import { getCurrentBaby } from "../../services/partner_api";

function Day_card() {
    const [aDay, setDay] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                const birthDate = new Date(baby.b_birth);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let nextBookDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBookDate < today) {
                    nextBookDate.setFullYear(nextBookDate.getFullYear() + 1);
                }
                const diffMs = nextBookDate - today;
                const diff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                setDay(diff);
                const totalDays = 365; 
                const passedDays = totalDays - diff;
                const percentage = Math.max(0, Math.min(100, Math.floor((passedDays / totalDays) * 100)));
                setProgress(percentage);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-card-base">
            <div className="day-card-header">
                <h3 className="day-card-title">다음 디지털 북까지</h3>
                <span className="day-card-subinfo">12개월 달성 시 자동 생성</span>
            </div>
            
            <h1 className="day-card-value">D-{aDay}</h1>

            <progress value={progress} max="100" className="home-progress"></progress>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#B5AFA4", marginTop: "4px"}}>
                <span>출생</span>
                <span className="day-card-hint">{progress}% 완료</span>
                <span>12개월</span>
            </div>
        </div>
    );
}

export default Day_card;