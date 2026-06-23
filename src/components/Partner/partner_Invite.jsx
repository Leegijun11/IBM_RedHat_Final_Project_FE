import { useState } from "react";
import { createPartner } from "../../services/partner_api";
import { createAlarm } from "../../services/alarm_api";
import useAuth from "../../hooks/useAuth";

function Partner_invite({ onClose }) {
  const { my_id } = useAuth(); 
  const [u_id, setU_id] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    try {
      const result = await createPartner(u_id);
      console.log(result);

      // 초대 알람 생성
      await createAlarm({
        send_id: my_id,
        receive_id: u_id,
      });

      alert("공동 양육자를 초대하였습니다.");
      setU_id("");
      if (onClose) onClose();
    } catch (error) {
      console.log(error);
      alert("공동 양육자 초대에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>공동 양육자 초대</h2>

      <form onSubmit={handleCreatePartner}>
        <input
          type="number"
          placeholder="유저 ID"
          value={u_id}
          onChange={(e) => setU_id(e.target.value)}
        />
        <button type="submit">초대하기</button>
        <button type="button" onClick={onClose}>취소</button>
      </form>
    </div>
  );
}

export default Partner_invite;