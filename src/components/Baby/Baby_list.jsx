import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../hooks/imageUrl";
import { setCurrentBaby } from "../../services/partner_api";
import "../../styles/Baby_list.css";

function calculateAgeInMonths(birthDateStr) {
  const birth = new Date(birthDateStr);
  const today = new Date();

  let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  
  if (years > 0) {
    return `${years}세 ${remainMonths}개월`;
  }
  return `${remainMonths}개월`;
}

function Baby_list({ babies, selectedBabyId, onSelect, onEdit }) {
  const navigate = useNavigate();

  const handleSelectAndGoHome = async (b_id) => {
    try {
      await setCurrentBaby(b_id);
      onSelect(b_id);
      navigate("/home");
    } catch (error) {
      console.log(error);
      alert("아이 선택에 실패했습니다.");
    }
  };

  return (
    <div className="baby-list-container">
      {babies.map((baby) => {
        const isSelected = baby.b_id === selectedBabyId;
        
        return (
          <div 
            key={baby.b_id} 
            className={`baby-card ${isSelected ? "selected" : ""}`}
          >
            {/* 프로필 이미지 & 체크 배지 래퍼 */}
            <div className="baby-avatar-wrapper">
              {baby.b_image && (
                <img src={getImageUrl(baby.b_image)} alt={baby.b_name} className="baby-avatar" />
              )}
              {isSelected && <div className="selected-check">✔️</div>}
            </div>

            <div className="baby-info">
              <span className="baby-name">{baby.b_name}</span>
              <span className="baby-age">{calculateAgeInMonths(baby.b_birth)}</span>
            </div>
            
            <div className="baby-actions">
              {isSelected ? (
                <span className="current-badge">현재</span>
              ) : (
                <button className="select-btn" onClick={() => handleSelectAndGoHome(baby.b_id)}>선택</button>
              )}
              
              <button className="edit-icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(baby.b_id); }}>
                ✎
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Baby_list;