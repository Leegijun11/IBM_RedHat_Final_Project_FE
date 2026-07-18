import { useEffect, useState } from "react";
import { getPartnerList, deletePartner } from "../../services/partner_api";
import { getImageUrl } from "../../hooks/imageUrl";
import { useModal } from "../../hooks/useModal";
import "../../styles/partner_list.css"; 

function PartnerList({ currentUserId }) {
  const [partnerList, setPartnerList] = useState([]);
  const { showAlert, showConfirm } = useModal();
  
  const handleGetPartnerList = async () => {
    try {
      const result = await getPartnerList();
      setPartnerList(result);
    } catch (error) {
      console.error(error);
      setPartnerList([]); 
    }
  };

  useEffect(() => {
    handleGetPartnerList();
  }, []);

  const handleDeletePartner = async (p_id) => {
    const confirmed = await showConfirm("공동 양육자 지정을 취소하시겠습니까?")
    if (!confirmed) return;

    try {
      await deletePartner(p_id);
      showAlert("공동 양육자 지정이 취소되었습니다.");
      handleGetPartnerList();
    } catch (error) {
      console.error(error);
      showAlert("공동 양육자 삭제에 실패하였습니다.");
    }
  };

  const getStateBadgeClass = (state) => {
    if (state === "active") return "active";
    if (state === "거절됨") return "rejected";
    return "pending";
  };

  const getStateLabel = (state) => {
    if (state === "active") return "활성";
    return state;
  };

  return (
    <div className="partner-list-container">
      {partnerList.length === 0 ? (
        <p className="empty-message">등록된 공동 양육자가 없습니다.</p>
      ) : (
        partnerList.map((partner) => (
          <div key={partner.p_id} className="partner-card">
            
            <div className="partner-avatar-wrapper">
              {partner.u_image ? (
                <img
                  src={getImageUrl(partner.u_image)}
                  alt={partner.u_name}
                  className="partner-avatar"
                />
              ) : (
                <div className="partner-avatar-placeholder">👤</div>
              )}
            </div>

            <div className="partner-info">
              <span className="partner-name">
                {partner.u_name} <span className="partner-role">({partner.p_role})</span>
              </span>
              <span className="partner-relation">{partner.p_category}</span>
            </div>

            <div className="partner-actions">
              <span className={`status-badge ${getStateBadgeClass(partner.p_state)}`}>
                {getStateLabel(partner.p_state)}
              </span>

              {partner.u_id !== currentUserId && (
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeletePartner(partner.p_id)}
                  title="삭제"
                >
                  ✕
                </button>
              )}
            </div>
            
          </div>
        ))
      )}
    </div>
  );
}

export default PartnerList;