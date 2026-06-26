import { useState } from "react";
import { getAlarm, deleteAlarm } from "../../Services/alarm_api";
import {
  findPartner,
  updatePartner,
  deletePartner,
} from "../../Services/partner_api";
import useAuth from "../../Hooks/useAuth";
import AlarmModal from "./Alarm_modal";

function Alarm_list() {
  console.log("Alarm_list 렌더링");

  const { my_id } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  // 알람 조회
  const fetchAlarms = async () => {
    console.log("FetchAlarms 호출됨");

    try {
      const result = await getAlarm(my_id);

      console.log("알람 목록", result);

      setAlarms(Array.isArray(result) ? result : []);
    } catch (error) {
      if (error.response?.status === 404) {
        setAlarms([]);
      }
      console.error(error);
      alert("알람을 불러오는데 실패하였습니다.");
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
      // 양육자 찾기
      const partner = await findPartner(
        alarm.send_id,
        alarm.g_id
      );

      // 상태 변경
      await updatePartner(partner.p_id, {
        p_role: partner.p_role,
        p_category: partner.p_category,
        p_state: "승인",
        current_b_id: partner.current_b_id,
      });

      // 알람 삭제
      await deleteAlarm(alarm.a_id);

      alert("수락 되었습니다.");

      setSelectedAlarm(null);

      fetchAlarms();
    } catch (error) {
      console.error(error);
      alert("수락에 실패하였습니다.");
    }
  };

  // 거절
  const handleReject = async (alarm) => {
    try {
      // 양육자 찾기
      const partner = await findPartner(
        alarm.send_id,
        alarm.g_id
      );

      // 공동 양육자 삭제
      await deletePartner(partner.p_id);

      // 알람 삭제
      await deleteAlarm(alarm.a_id);

      alert("거절 되었습니다.");

      setSelectedAlarm(null);

      fetchAlarms();
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

                <button onClick={() => setSelectedAlarm(alarm)}>
                  열기
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <AlarmModal
        alarm={selectedAlarm}
        onAccept={handleAccept}
        onReject={handleReject}
        onClose={() => setSelectedAlarm(null)}
      />
    </div>
  );
}

export default Alarm_list;