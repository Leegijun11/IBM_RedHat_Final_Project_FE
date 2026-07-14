import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 리액트 캘린더 기본 CSS (필수)
import { useNavigate } from "react-router-dom"; // 뒤로가기 버튼용
import { getBabyLogs } from "../../services/logs_api";
import { getCurrentBaby } from "../../services/partner_api";
import "../../styles/record_calendar.css"; // 커스텀 CSS 연결

function Record_Calendar() {
    const navigate = useNavigate();
    const [bId, setBId] = useState(null);
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState(new Set());

    useEffect(() => {
        const init = async () => {
            const baby = await getCurrentBaby();
            if (baby) {
                setBId(baby.b_id);
                const allLogs = await getBabyLogs(baby.b_id);
                setLogs(allLogs);

                const dateStrings = allLogs.map(log => log.l_date.split("T")[0]);
                setMarkedDates(new Set(dateStrings));
            }
        };
        init();
    }, []);

    const formatDate = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = formatDate(date);
            if (markedDates.has(dateStr)) {
                return <div className="marked-dot">●</div> // 점 디자인을 위한 클래스 추가
            }
        }
        return null;
    };

    const selectedDateStr = formatDate(selectedDate);
    const logsForSelectedDate = logs.filter(log => log.l_date.split("T")[0] === selectedDateStr);

    return (
        <div className="record-calendar-container">
            {/* 1. 커스텀 헤더 */}
            <div className="calendar-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로</button>
                <h2>기록 조회 📖</h2>
            </div>
            
            {/* 2. 캘린더 영역 (카드 형태) */}
            <div className="calendar-wrapper">
                <Calendar 
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    formatDay={(locale, date) => date.getDate()} // '1일', '2일'에서 '일' 글자 제거
                    next2Label={null} // '>>' 버튼 숨김 (깔끔한 UI)
                    prev2Label={null} // '<<' 버튼 숨김
                />
            </div>

            {/* 3. 선택된 날짜의 기록 리스트 */}
            <div className="record-list-container">
                <h3 className="record-list-title">
                    {new Date(selectedDate).getMonth() + 1}월 {new Date(selectedDate).getDate()}일의 기록
                </h3>
                
                <div className="record-items-wrapper">
                    {logsForSelectedDate.length > 0 ? (
                        logsForSelectedDate.map(log => (
                            <div key={log.l_id} className="record-card">
                                <p>{log.l_content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="empty-record">
                            <p>작성된 기록이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Record_Calendar;