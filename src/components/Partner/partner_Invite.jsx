import { useState } from "react";
import { createPartner } from "../../Services/partner_api";
import { createAlarm } from "../../Services/alarm_api";
import useAuth from "../../Hooks/useAuth";

function PartnerInvite({ onClose }) {
  const { my_id } = useAuth();

  const [u_id, setU_id] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    try {
      const result = await createPartner({
        p_role: "보호자",
        p_category: "가족",
        p_state: "대기",
        g_id: 1,
        u_id: Number(u_id),
      });

      console.log(result);

      await createAlarm({
        send_id: my_id,
        receive_id: Number(u_id),
      });

      alert("공동 양육자를 초대하였습니다.");

      setU_id("");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("공동 양육자 초대에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>공동 양육자 초대</h2>

      <form onSubmit={handleCreatePartner}>
        <input
          type="number"
          placeholder="유저 ID 입력"
          value={u_id}
          onChange={(e) => setU_id(e.target.value)}
        />

        <button type="submit">초대하기</button>

        <button type="button"onClick={onClose}>취소</button>
      </form>
    </div>
  );
}

export default PartnerInvite;