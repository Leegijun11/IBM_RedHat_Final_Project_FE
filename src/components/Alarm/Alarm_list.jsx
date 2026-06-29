import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../Services/alarm_api";
import { createPartner } from "../../Services/partner_api";

function Alarm_list({ onAccept }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);

  // 알람 조회
  const fetchAlarms = async () => {
    try {
      const result = await getAlarm();
      setAlarms(Array.isArray(result) ? result : []);
    } catch (error) {
      if (error.response?.status === 404) {
        setAlarms([]);
      } else {
        console.error(error);
        setAlarms([]);
      }
    }
  };

  // 알람함 열기
  const handleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      fetchAlarms();
    }
  };

  // 수락
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

      if (onAccept) {
        onAccept();
      }
    } catch (error) {
      console.error(error);
      alert("초대 수락에 실패하였습니다.");
    }
  };

  // 거절
  const handleDelete = async (a_id) => {
    try {
      await deleteAlarm(a_id);
      setAlarms((prev) => prev.filter((alarm) => alarm.a_id !== a_id));
    } catch (error) {
      console.error(error);
      alert("거절 처리에 실패했습니다.");
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>🔔 알림함</button>

      {isOpen && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>알림 목록</h3>

          {alarms.length === 0 ? (
            <p>받은 알람이 없습니다.</p>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.a_id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                }}
              >
                <p>
                  <strong>공동 양육자 초대</strong>
                </p>

                <p>공동 양육자로 초대되었습니다.</p>
                <p>그룹 ID : {alarm.g_id}</p>

                <button onClick={() => handleAccept(alarm)}>
                  수락
                </button>

                <button onClick={() => handleDelete(alarm.a_id)}>
                  거절
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Alarm_list;