import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../Services/alarm_api";
import { createPartner } from "../../Services/partner_api";

function Alarm_list({ onAccept }) {
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

    const handleOpen = () => {
        if (!isOpen) fetchAlarms();
        setIsOpen((prev) => !prev);
    };

    const handleAccept = async (alarm) => {
        try {
            await createPartner({
                p_role: "parent",
                p_category: "guardian",
                p_state: "active",
                g_id: alarm.g_id,
                u_id: alarm.receive_id,
            });
            await deleteAlarm(alarm.a_id);
            setAlarms((prev) => prev.filter((a) => a.a_id !== alarm.a_id));
            alert("공동 양육자 초대를 수락하였습니다.");
            if (onAccept) onAccept();
        } catch (error) {
            console.error(error);
            alert("초대 수락에 실패하였습니다.");
        }
    };

    const handleDelete = async (a_id) => {
        try {
            await deleteAlarm(a_id);
            setAlarms((prev) => prev.filter((alarm) => alarm.a_id !== a_id));
            alert("알람이 삭제되었습니다.");
        } catch (error) {
            console.error(error);
            alert("알람 삭제에 실패하였습니다.");
        }
    };

    return (
        <div className="alarm-wrap">
            <button className="alarm-trigger-btn" onClick={handleOpen}>
                🔔
            </button>

            {alarms.length > 0 && <span className="alarm-badge" />}

            {isOpen && (
                <div className="alarm-dropdown">
                    {alarms.length === 0 ? (
                        <p>받은 알람이 없습니다.</p>
                    ) : (
                        alarms.map((alarm) => (
                            <div key={alarm.a_id} className="alarm-item">
                                <p className="alarm-item-title">공동 양육자 초대 알림</p>
                                <p>보낸 사람 : {alarm.send_id}</p>
                                <p>그룹 ID : {alarm.g_id}</p>
                                <div className="alarm-item-actions">
                                    <button onClick={() => handleAccept(alarm)}>수락</button>
                                    <button onClick={() => handleDelete(alarm.a_id)}>거절</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Alarm_list;