import { useEffect, useState } from "react";
import { getPartnerList, deletePartner } from "../../services/partner_api"; // 경로 대소문자 확인 필요 (Services -> services)
import { getImageUrl } from "../../hooks/imageUrl";
import "../../styles/partner_list.css"; // 🔥 스타일 파일 연결

function PartnerList() {
  const [partnerList, setPartnerList] = useState([]);

  const handleGetPartnerList = async () => {
    try {
      const result = await getPartnerList();
      console.log("목록결과", result);
      setPartnerList(result);
    } catch (error) {
      console.error(error);
      setPartnerList([]); // alert 대신 조용히 빈 목록 처리
    }
  };

  useEffect(() => {
    handleGetPartnerList();
  }, []);

  const handleDeletePartner = async (p_id) => {
    try {
      await deletePartner(p_id);
      alert("공동 양육자 지정이 취소되었습니다.");
      handleGetPartnerList();
    } catch (error) {
      console.error(error);
      alert("공동 양육자 삭제에 실패하였습니다.");
    }
  };

  return (
    <div className="partner-list-container">
      {partnerList.length === 0 ? (
        <p className="empty-message">등록된 공동 양육자가 없습니다.</p>
      ) : (
        partnerList.map((partner) => (
          <div key={partner.p_id} className="partner-card">
            
            {/* 1. 프로필 이미지 */}
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

            {/* 2. 양육자 정보 (이름, 역할, 관계) */}
            <div className="partner-info">
              <span className="partner-name">
                {partner.u_name} <span className="partner-role">({partner.p_role})</span>
              </span>
              <span className="partner-relation">{partner.p_category}</span>
            </div>

            {/* 3. 상태 배지 및 삭제 버튼 */}
            <div className="partner-actions">
              <span className={`status-badge ${partner.p_state === 'active' ? 'active' : 'pending'}`}>
                {partner.p_state === 'active' ? '활성' : partner.p_state}
              </span>
              <button 
                className="delete-btn" 
                onClick={() => handleDeletePartner(partner.p_id)}
                title="삭제"
              >
                ✕
              </button>
            </div>
            
          </div>
        ))
      )}
    </div>
  );
}

export default PartnerList;