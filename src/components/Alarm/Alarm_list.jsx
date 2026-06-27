import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../Services/alarm_api";
import { createPartner } from "../../Services/partner_api";

function Alarm_list() {
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
    } catch (error) {
      console.error(error);
      alert("초대 수락에 실패하였습니다.");
    }
  };

  // 거절 (삭제)
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
    <div>
      <button onClick={handleOpen}>알람함</button>

      {isOpen && (
        <div>
          {alarms.length === 0 ? (
            <p>받은 알람이 없습니다.</p>
          ) : (
            alarms.map((alarm) => (
              <div
                key={alarm.a_id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>공동 양육자 초대 알림</p>

                <p>보낸 사람 ID : {alarm.send_id}</p>

                <p>그룹 ID : {alarm.g_id}</p>

                <button onClick={() => handleAccept(alarm)}>수락</button>
                <button onClick={() => handleDelete(alarm.a_id)}>거절</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Alarm_list;