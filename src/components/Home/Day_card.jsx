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
                
                // 시간 오차 방지를 위해 모두 자정으로 설정
                today.setHours(0, 0, 0, 0);
                
                // 1. 올해의 생일 날짜 구하기
                let nextBookDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

                // 2. 만약 올해 생일이 지났다면, 내년 생일로 설정
                if (nextBookDate < today) {
                    nextBookDate.setFullYear(nextBookDate.getFullYear() + 1);
                }

                // 3. 1년 주기 계산 (작년 기념일 ~ 올해/내년 기념일)
                const lastYearDate = new Date(nextBookDate);
                lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);

                // 4. D-Day 계산
                const diffMs = nextBookDate - today;
                const diff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                setDay(diff);

                // 5. 진행률 계산 (전체 365일 중 현재 몇 일 지났는지)
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
        <div style={{ border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>
            <h3>다음 디지털 북까지</h3>
            
            <h1>D-{aDay}</h1>

            <p>12개월 달성 시 자동 생성</p>

            <progress value={progress} max="100" style={{ width: "100%" }}></progress>

            <p>{progress}% 완료</p>
        </div>
    );
}

export default Day_card;