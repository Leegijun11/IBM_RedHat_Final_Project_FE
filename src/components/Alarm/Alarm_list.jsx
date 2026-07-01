import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../services/alarm_api";
import { createPartner } from "../../services/partner_api";
import "../../styles/Alarm_list.css";

function Alarm_list({ onAccept }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const fetchAlarms = async () => {
    try {
      const result = await getAlarm();
      console.log("알람 목록", result);
      setAlarms(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
      setAlarms([]);
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      fetchAlarms();
    }
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
    <div className="alarm-container">
      {/* 종 모양 버튼 */}
      <button className="alarm-bell-btn" onClick={handleOpen}>
        <span className="bell-icon">🔔</span>
        {/* 새 알림이 있을 때 보여줄 빨간 점 (선택 사항) */}
        {alarms.length > 0 && <span className="alarm-dot"></span>}
      </button>

      {/* 드롭다운 형태의 알림 목록 */}
      {isOpen && (
        <div className="alarm-dropdown">
          {alarms.length === 0 ? (
            <div className="alarm-empty">받은 알람이 없습니다.</div>
          ) : (
            alarms.map((alarm) => (
              <div key={alarm.a_id} className="alarm-item">
                <div className="alarm-content">
                  <p className="alarm-title">공동 양육자 초대 알림</p>
                  <p className="alarm-text">
                    <strong>{alarm.sender_name}</strong>님이 초대를 보냈습니다.
                  </p>
                </div>
                
                <div className="alarm-actions">
                  <button className="accept-btn" onClick={() => handleAccept(alarm)}>수락</button>
                  <button className="reject-btn" onClick={() => handleDelete(alarm.a_id)}>거절</button>
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