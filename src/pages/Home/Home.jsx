import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Baby_header from "../../components/Baby/Baby_header";
import Day_card from "../../Components/Home/Day_card";
import Photo_card from "../../Components/Home/Photo_card";
import Record_card from "../../Components/Home/Record_card";
import Tip_card from "../../Components/Home/Tip_card";
import Growth_card from "../../Components/Home/Growth_card";
import Alarm_list from "../../components/Alarm/Alarm_list";
import NaviBar from "../../components/common/NaviBar";
function Home() {
    const navigate = useNavigate();

    return (
        <div style={{padding: "20px"}}>

            {/* 상단: 아이 정보 + 알림 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Baby_header />
                <Alarm_list />
            </div>

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

            <NaviBar/>
        </div>
    );
}

export default Home;