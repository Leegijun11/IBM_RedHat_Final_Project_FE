import { useEffect, useState } from "react";

function Day_card() {
    const [aDay, setDay] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        // 임시 데이터 추후 변경
        const birthDate = new Date("2025-02-01");
        const today = new Date();

        // 다음 디지털 북 생성일 (6개월)
        const nextBookDate = new Date(birthDate);
        nextBookDate.setMonth(nextBookDate.getMonth() + 6);

        const diff = Math.ceil((nextBookDate - today) / (1000 * 60 * 60 * 24));
        setDay(diff);

        const totalDays = Math.ceil((nextBookDate - birthDate) / (1000 * 60 * 60 * 24));

        const passedDays = totalDays - diff;

        setProgress(Math.floor((passedDays / totalDays) * 1000));
    }, []);

    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>
            <h3>다음 디지털 북까지</h3>

            <h1>D-{aDay}</h1>

            <p>6개월 달성 시 자동 생성</p>

            <progress value={progress} max="100"></progress>

            <p>{progress}% 완료</p>
        </div>
    );
}

export default Day_card;