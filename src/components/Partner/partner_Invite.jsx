import { useState } from "react";
import { createAlarm } from "../../Services/alarm_api";
import "../../styles/Partner_invite.css"; // 스타일 파일 연결

function PartnerInvite({ onClose }) {
  const [u_account, setU_account] = useState("");

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    try {
      await createAlarm({ receive_account: u_account });
      alert("공동 양육자 초대를 보냈습니다.");
      setU_account("");
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.detail || "공동 양육자 초대에 실패하였습니다.";
      alert(message);
    }
  };

  return (
    <div className="invite-dropdown">
      <h3 className="invite-title">공동 양육자 초대</h3>

      <form onSubmit={handleCreatePartner} className="invite-form">
        <input
          className="invite-input"
          type="text"
          placeholder="초대할 사용자의 아이디 입력"
          value={u_account}
          onChange={(e) => setU_account(e.target.value)}
          required
        />

        <div className="invite-btn-group">
          <button type="submit" className="submit-btn">초대하기</button>
          <button type="button" className="cancel-btn" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default PartnerInvite;