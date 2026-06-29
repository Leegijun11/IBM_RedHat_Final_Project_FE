import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../hooks/imageUrl";
import { setCurrentBaby } from "../../Services/partner_api";

function calculateAgeInMonths(birthDateStr) {
  const birth = new Date(birthDateStr);
  const today = new Date();

  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

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
    <div>
      {babies.map((baby) => (
        <div
          key={baby.b_id}
          style={{
            border:
              baby.b_id === selectedBabyId
                ? "2px solid #ff8a80"
                : "1px solid #eee",
          }}
        >
          {baby.b_image && (
            <img
              src={getImageUrl(baby.b_image)}
              alt={baby.b_name}
              width="50"
              height="50"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <span>{baby.b_name}</span>
          <span>{calculateAgeInMonths(baby.b_birth)}</span>

          {baby.b_id === selectedBabyId && <span>현재</span>}

          <button type="button" onClick={() => handleSelectAndGoHome(baby.b_id)}>
            선택
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(baby.b_id);
            }}
          >
            ✎
          </button>
        </div>
      ))}
    </div>
  );
}

export default Baby_list;