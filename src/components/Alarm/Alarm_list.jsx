import { useEffect, useState } from "react";
import { getAlarm, deleteAlarm } from "../../services/alarm_api";
import { createPartner } from "../../services/partner_api";
import "../../styles/Alarm_list.css";
import { updatePartnerState } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";

function Alarm_list({ onAccept }) {
    const { showAlert } = useModal();
    const [isOpen, setIsOpen] = useState(false);
    const [alarms, setAlarms] = useState([]);

    const fetchAlarms = async () => {
        try {
            const result = await getAlarm();
            setAlarms(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error(error);
            setAlarms([]);
        }
    };

    useEffect(() => {
        fetchAlarms();
    }, [])

    const handleOpen = () => {
        setIsOpen((prev)=>!prev)
    };

    const handleAccept = async (alarm) => {
        try {
            await createPartner({
                p_role: "",
                p_category: alarm.p_category,
                p_state: "active",
                g_id: alarm.g_id,
                u_id: alarm.receive_id,
            });
            await deleteAlarm(alarm.a_id);
            setAlarms((prev) => prev.filter((a) => a.a_id !== alarm.a_id));
            if (onAccept) onAccept();
        } catch (error) {
            console.error(error);
            showAlert("초대 수락에 실패하였습니다.", "error");
        }
        console.log(alarm)
    };

    const handleDelete = async (a_id, alarm) => {
        try {
            // 초대 알람이면 상태를 거절됨으로 변경
            if (alarm?.a_type === "invite") {
                await updatePartnerState("거절됨");
            }
            await deleteAlarm(a_id);
            setAlarms((prev) => prev.filter((a) => a.a_id !== a_id));
        } catch (error) {
            console.error(error);
            showAlert("알람 삭제에 실패하였습니다.", "error");
        }
    };

    return (
        <div className="alarm-container">
            <button className="alarm-bell-btn" onClick={handleOpen}>
                <span className="bell-icon">🔔</span>
                {alarms.length > 0 && <span className="alarm-dot"></span>}
            </button>

            {isOpen && (
                <div className="alarm-dropdown">
                    {alarms.length === 0 ? (
                        <div className="alarm-empty">받은 알람이 없습니다.</div>
                    ) : (
                        alarms.map((alarm) => (
                            <div key={alarm.a_id} className="alarm-item">

                                {/* ★ a_type 기반 분기 렌더링 */}
                                {alarm.a_type === "diary" ? (
                                    // 자동 일기 생성 알림
                                    <>
                                        <div className="alarm-content">
                                            <p className="alarm-title">오늘의 일기가 완성됐어요</p>
                                            <p className="alarm-text">
                                                AI가 오늘의 기록을 일기로 만들었어요. 확인해보세요!
                                            </p>
                                        </div>
                                        <div className="alarm-actions">
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleDelete(alarm.a_id)}
                                            >
                                                확인
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // 공동 양육자 초대 알림 (기존)
                                    <>
                                        <div className="alarm-content">
                                            <p className="alarm-title">공동 양육자 초대 알림</p>
                                            <p className="alarm-text">
                                                <strong>{alarm.sender_name}</strong>님이 초대를 보냈습니다.
                                            </p>
                                        </div>
                                        <div className="alarm-actions">
                                            <button
                                                className="accept-btn"
                                                onClick={() => handleAccept(alarm)}
                                            >
                                                수락
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleDelete(alarm.a_id, alarm)}
                                            >
                                                거절
                                            </button>
                                        </div>
                                    </>
                                )}

                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Alarm_list;