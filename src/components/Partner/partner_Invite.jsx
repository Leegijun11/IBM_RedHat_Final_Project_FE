import { useState } from "react";
import { createPartner } from "../../services/partner_api";
import { createAlarm } from "../../services/alarm_api";

function Partner_invite() {
  const [u_id, setU_id] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    try {
      const result = await createPartner(u_id);
      console.log(result);

      // 초대 알람 생성
      await createAlarm({
        receive_id: u_id, // 알람 받을 사람
        content: "공동 양육자로 초대되었습니다.",
      });

      alert("공동 양육자를 초대하였습니다.");
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
      </form>
    </div>
  );
}

export default Partner_invite;