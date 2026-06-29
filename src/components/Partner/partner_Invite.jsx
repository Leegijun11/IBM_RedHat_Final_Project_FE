import { useState } from "react";
import { createAlarm } from "../../Services/alarm_api";

function PartnerInvite({ onClose }) {
  const [u_account, setU_account] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    try {
      await createAlarm({
        receive_account: u_account,
      });

      alert("공동 양육자 초대를 보냈습니다.");

      setU_account("");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.detail ||
        "공동 양육자 초대에 실패하였습니다.";

      alert(message);
    }
  };

  return (
    <div>
      <h2>공동 양육자 초대</h2>

      <form onSubmit={handleCreatePartner}>
        <input
          type="text"
          placeholder="초대할 사용자의 아이디 입력"
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