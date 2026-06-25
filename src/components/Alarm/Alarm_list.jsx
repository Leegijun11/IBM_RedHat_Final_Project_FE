import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../Services/alarm_api";
import useAuth from "../../Hooks/useAuth";

function Alarm_list() {
  const { my_id } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const fetchAlarms = async () => {
    try {
      const result = await getAlarm(my_id);

      console.log("알람 목록", result);

      setAlarms(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
      alert("알람을 불러오는데 실패하였습니다.");
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      fetchAlarms();
    }

    setIsOpen((prev) => !prev);
  };

  const handleDelete = async (a_id) => {
    try {
      await deleteAlarm(a_id);

      setAlarms((prev) =>
        prev.filter((alarm) => alarm.a_id !== a_id)
      );

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
                {/* 백엔드에서 content를 안 주므로 직접 표시 */}
                <p>공동 양육자 초대 알림</p>

                <p>보낸 사람 ID : {alarm.send_id}</p>

                <p>그룹 ID : {alarm.g_id}</p>

                <button
                  onClick={() => handleDelete(alarm.a_id)}
                >
                  삭제
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