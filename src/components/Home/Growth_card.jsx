import { useState, useEffect } from "react";
import { getCurrentBaby } from "../../services/partner_api";

function Growth_card() {
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baby = await getCurrentBaby();
                setHeight(baby.b_height);
                setWeight(baby.b_weight);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="growth-grid-wrap">
            <div className="growth-item-box bg-orange">
                <h3 className="text-orange">키</h3>
                <h2 className="text-orange">{height !== null ? `${height}cm` : "-"}</h2>
            </div>

            <div className="growth-item-box bg-green">
                <h3 className="text-green">몸무게</h3>
                <h2 className="text-green">{weight !== null ? `${weight}kg` : "-"}</h2>
            </div>

            <div className="growth-item-box bg-purple">
                <h3 className="text-purple">연속 기록</h3>
                <h2 className="text-purple">{streak}일</h2>
                {streak > 0 && <p className="text-sub-purple">달성! 🎉</p>}
            </div>
        </div>
    );
}

export default Growth_card;