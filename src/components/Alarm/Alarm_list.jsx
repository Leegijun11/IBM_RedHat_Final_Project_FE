import { useState, useEffect } from "react";
import { getAlarm, deleteAlarm } from "../../services/alarm_api";
import useAuth from "../../hooks/useAuth";

function Alarm_list() {
  const {my_id} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const fetchAlarms = async () => {
    try {
      const result = await getAlarm(my_id);
      console.log(result);
      setAlarms(Array.isArray(result) ? result : result.alarm || []);
    } catch (error) {
      console.log(error);
      alert("알람을 불러오는데 실패하였습니다.");
    }
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchAlarms();
    }
  };

  const handleDelete = async (a_id) => {
    try {
      await deleteAlarm(a_id);
      setAlarms((prev) => prev.filter((alarm) => alarm.a_id !== a_id));
    } catch (error) {
      console.log(error);
      alert("알람 삭제에 실패하였습니다.");
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>알람함</button>

      {isOpen && (
        <div>
          {alarms.length === 0 && <p>받은 알람이 없습니다.</p>}

          {alarms.map((alarm) => (
            <div key={alarm.a_id}>
              <p>{alarm.content}</p>
              <button onClick={() => handleDelete(alarm.a_id)}>x</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alarm_list;