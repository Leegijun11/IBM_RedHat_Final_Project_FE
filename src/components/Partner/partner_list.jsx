import { useEffect, useState } from "react";
import { getPartnerList, deletePartner } from "../../Services/partner_api";
import useAuth from "../../Hooks/useAuth";

function PartnerList() {
  const { my_id } = useAuth();

  console.log("partnerList my_id =", my_id)

  const [partnerList, setPartnerList] = useState([]);

  const handleGetPartnerList = async () => {
    if (!my_id) {
      console.log("my_id 없음 :", my_id);
      return;
    }

    try {
      const result = await getPartnerList(my_id);

      console.log("목록결과", result);

      setPartnerList(result);
    } catch (error) {
      console.error(error);

      alert("공동 양육자 목록을 불러오는데 실패하였습니다.");
    }
  };

  useEffect(() => {
    console.log("useEffect my_id =", my_id);

    if (!my_id) return;
    handleGetPartnerList();
  }, [my_id]);

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

      {partnerList.map((partner) => (
        <div
          key={partner.p_id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>이름 : {partner.u_name}</p>
          <p>역할 : {partner.p_role}</p>
          <p>관계 : {partner.p_category}</p>
          <p>상태 : {partner.p_state}</p>

          <button onClick={() => handleDeletePartner(partner.p_id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

export default PartnerList;