import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Baby_header from "../../components/Baby/Baby_header";
import Day_card from "../../components/Home/Day_card";
import Photo_card from "../../components/Home/Photo_card";
import Record_card from "../../components/Home/Record_card";
import Tip_card from "../../components/Home/Tip_card";
import Growth_card from "../../components/Home/Growth_card";
import Alarm_list from "../../components/Alarm/Alarm_list";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/Home.css";

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
        <div className="home-main-view">

            {/* 상단 헤더: 아이 정보 + 알림 */}
            <div className="home-header-bar">
                <Baby_header />
                <Alarm_list />
            </div>

            {/* D-Day */}
            <Day_card />

            {/* 사진 찍기 + 오늘의 기록 → 2열 */}
            <div className="action-cards-row">
                <Photo_card />
                <Record_card />
            </div>

            {/* AI 발달 팁 */}
            <Tip_card />

            {/* 성장 정보 */}
            <Growth_card />

            <NaviBar />
        </div>
    );
}

export default Home;