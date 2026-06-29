import { useEffect, useState } from "react";
import { getPartnerList, deletePartner } from "../../Services/partner_api";
import { getImageUrl } from "../../hooks/imageUrl";

function PartnerList() {
  const [partnerList, setPartnerList] = useState([]);

  const handleGetPartnerList = async () => {
    try {
      const result = await getPartnerList();

      console.log("목록결과", result);

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
    <div>
      <h2>공동 양육자 목록</h2>

      {partnerList.length === 0 ? (
        <p>등록된 공동 양육자가 없습니다.</p>
      ) : (
        partnerList.map((partner) => (
          <div
            key={partner.p_id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {partner.u_image && (
              <img
                src={getImageUrl(partner.u_image)}
                alt={partner.u_name}
                width="40"
                height="40"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}

            <p>이름 : {partner.u_name}</p>
            <p>역할 : {partner.p_role}</p>
            <p>관계 : {partner.p_category}</p>
            <p>상태 : {partner.p_state}</p>

            <button onClick={() => handleDeletePartner(partner.p_id)}>
              삭제
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default PartnerList;