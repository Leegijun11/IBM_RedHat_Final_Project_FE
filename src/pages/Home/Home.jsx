import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Baby_header from "../../components/Baby/Baby_header";
import Day_card from "../../components/Home/Day_card";
import Photo_card from "../../components/Home/Photo_card";
import Record_card from "../../components/Home/Record_card";
import Tip_card from "../../components/Home/Tip_card";
import Growth_card from "../../components/Home/Growth_card";
import Alarm_list from "../../components/Alarm/Alarm_list";
import NaviBar from "../../components/common/NaviBar";

function Home() {
    const navigate = useNavigate();

    // 로그인 체크
    useEffect(() => {
        const my_id = localStorage.getItem("u_id");

        if (!my_id) {
            alert("로그인이 필요한 서비스 입니다.");
            navigate("/");
        }
    }, [navigate]);

    return (
        <div style={{ padding: "20px" }}>

            {/* 상단: 아이 정보 + 알림 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Baby_header />
                <Alarm_list />
            </div>

            {/* D-Day */}
            <Day_card />

            {/* 사진 */}
            <Photo_card />

            {/* 오늘의 기록 */}
            <Record_card />

            {/* AI 발달 팁 */}
            <Tip_card />

            {/* 성장 정보 */}
            <Growth_card />

            <NaviBar />
        </div>
    );
}

export default Home;