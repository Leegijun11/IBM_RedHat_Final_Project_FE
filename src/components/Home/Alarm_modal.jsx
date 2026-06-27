import { useState, useEffect } from "react";
import { createPartner } from "../../services/partner_api"; // 양육자 등록 API
import { getAlarm, deleteAlarm } from "../../services/alarm_api";
function Alarm_modal() {
    const [isOpen, setIsOpen] = useState(false);
    const [alarms, setAlarms] = useState([]);

    // 알림 목록 불러오기
    const fetchAlarms = async () => {
        try {
            const u_id = localStorage.getItem("u_id");
            if (!u_id) return;
            const data = await getAlarm(u_id);
            setAlarms(data);
        } catch (error) {
            console.error("알림 목록을 가져오는데 실패했습니다:", error);
        }
    };

    // 컴포넌트가 열릴 때마다 최신 알림 조회
    useEffect(() => {
        if (isOpen) {
            fetchAlarms();
        }
    }, [isOpen]);

    // 수락 처리
    const handleAccept = async (alarm) => {
        try {
            // 1. 양육자 등록 API 호출 (backend router_parents_create)
            await createParent({
                u_id: alarm.send_id, // 초대 보낸 사람을 양육자로 등록
                g_id: alarm.g_id    // 해당 그룹
            });

            // 2. 알림 삭제
            await deleteAlarm(alarm.a_id);
            
            alert("공동 양육자 초대를 수락하였습니다.");
            setIsOpen(false);
        } catch (error) {
            alert("수락 과정에서 오류가 발생했습니다.");
            console.error(error);
        }
    };

    // 거절 처리
    const handleReject = async (a_id) => {
        try {
            await deleteAlarm(a_id);
            alert("공동 양육자 초대를 거절하였습니다.");
            fetchAlarms(); // 목록 새로고침
        } catch (error) {
            alert("거절 실패");
        }
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setIsOpen(!isOpen)}>
                🔔 알림 {alarms.length > 0 ? `(${alarms.length})` : ""}
            </button>

            {isOpen && (
                <div style={{ border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginTop: "10px" }}>
                    <h2>알림 센터</h2>
                    {alarms.length === 0 ? (
                        <p>새로운 알림이 없습니다.</p>
                    ) : (
                        alarms.map((alarm) => (
                            <div key={alarm.a_id} style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #eee" }}>
                                <p><strong>{alarm.sender_name}</strong>님이 공동 양육자로 초대했습니다.</p>
                                <button onClick={() => handleAccept(alarm)}>수락</button>
                                <button onClick={() => handleReject(alarm.a_id)} style={{ marginLeft: "10px" }}>거절</button>
                            </div>
                        ))
                    )}
                    <button onClick={() => setIsOpen(false)} style={{ marginTop: "10px", width: "100%" }}>닫기</button>
                </div>
            )}
        </div>
    );
}

export default Alarm_modal;