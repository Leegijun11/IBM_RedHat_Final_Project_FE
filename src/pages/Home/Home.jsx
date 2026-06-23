import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Day_card from "../../Components/Home/Day_card";
import Photo_card from "../../Components/Home/Photo_card";
import Record_card from "../../Components/Home/Record_card";
import Tip_card from "../../Components/Home/Tip_card";
import Growth_card from "../../Components/Home/Growth_card";
import Alarm_modal from "../../Components/Home/Alarm_modal";

function Home() {
    const navigate = useNavigate();

    // 로그인 체크
   // useEffect(() => {
        // const my_id = localStorage.getItem("my_id");

        // if (!my_id) {
            // alert("로그인이 필요한 서비스 입니다.");
            // navigate("/");
        // }
    // },[]);

    return (
        <div style={{padding: "20px"}}>

            {/* 상단 */}
            <h1>홈</h1>

            {/* 알림 */}
            <Alarm_modal />

            {/* D - Day */}
            <Day_card />

            {/* 사진 찍기 */}
            <Photo_card />

            {/* 오늘의 기록 */}
            <Record_card />

            {/* AI 발달 팁 */}
            <Tip_card />

            {/* 성장 정보 */}
            <Growth_card />
        </div>
    );
}

export default Home;