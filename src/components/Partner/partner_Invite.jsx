import { useState } from "react";
import { createAlarm } from "../../services/alarm_api";
import "../../styles/partner_invite.css"; 

function PartnerInvite({ onClose, onRefresh }) {
  const [u_account, setU_account] = useState("");
  const [p_category, setP_category] = useState(""); 

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    try {
      await createAlarm({ 
        receive_account: u_account, 
        p_category: p_category 
      });
      
      alert("공동 양육자 초대를 보냈습니다.");
      setU_account("");
      setP_category("");
      
      // ★ 초대가 정상 성공하면 부모의 key 상태값을 1 올려 목록을 강제 재조회시킵니다.
      if (onRefresh) onRefresh(); 
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

        <input
          className="invite-input"
          type="text"
          placeholder="관계 입력 (예: 외할머니, 아빠, 이모)"
          value={p_category}
          onChange={(e) => setP_category(e.target.value)}
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