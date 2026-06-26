import { useState } from "react";
import { createPartner } from "../../Services/partner_api";
import { createAlarm } from "../../Services/alarm_api";
import { searchUser } from "../../Services/user_api";
import useAuth from "../../Hooks/useAuth";

function PartnerInvite({ onClose }) {
  const { my_id } = useAuth();

  const [u_account, setU_account] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    try {
      // 아이디로 유저 검색
  const user = await searchUser(u_account);
  console.log("1. searchUser", user);

  const partner = await createPartner({
    p_role: "보호자",
    p_category: "가족",
    p_state: "대기",
    g_id: 1,
    u_id: user.u_id,
});

console.log("2. createPartner", partner);

const alarm = await createAlarm({
  send_id: my_id,
  receive_id: user.u_id,
});

console.log("3. createAlarm", alarm);


      alert("공동 양육자를 초대하였습니다.");

      setU_account("");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);

      console.log(error.response);
      alert(error.response?.data?.detail || "에러 발생");
    }
  };

  return (
    <div>
      <h2>공동 양육자 초대</h2>

      <form onSubmit={handleCreatePartner}>
        <input
          type="text"
          placeholder="아이디 입력"
          value={u_account}
          onChange={(e) => setU_account(e.target.value)}
        />

        <button type="submit">초대하기</button>

        <button type="button" onClick={onClose}>
          취소
        </button>
      </form>
    </div>
  );
}

export default PartnerInvite;