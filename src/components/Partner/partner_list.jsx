import { useState, useEffect } from "react";
import { getPartnerList, deletePartner } from "../../services/partner_api";
import useAuth from "../../hooks/useAuth";

function Partner_list() {
  const { my_id } = useAuth();
  const [partnerList, setPartnerList] = useState([]);

  // 공동 양육자 목록 조회
  const handleGetPartnerList = async () => {
    try {
      const result = await getPartnerList(my_id);
      console.log(result);
      setPartnerList(result);
    } catch (error) {
      console.log(error);
      alert("공동 양육자 목록을 불러오는데 실패하였습니다.");
    }
  };

  useEffect(() => {
    if (my_id) {
      handleGetPartnerList();
    }
  }, [my_id]);

  // 공동 양육자 삭제
  const handleDeletePartner = async (partnerId) => {
    try {
      await deletePartner(partnerId);
      alert("공동 양육자 지정이 취소되었습니다.");
      handleGetPartnerList();
    } catch (error) {
      console.log(error);
      alert("공동 양육자 지정 취소에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>공동 양육자 목록</h2>

      {partnerList.map((partner, index) => (
        <div key={index}>
          <p>이름 : {partner.u_name}</p>
          <p>역할 : {partner.u_p_role}</p>
          <p>관계 : {partner.u_category}</p>
          <p>상태 : {partner.u_state}</p>
          <button onClick={() => handleDeletePartner(partner.u_id)}>삭제</button>
        </div>
      ))}
    </div>
  );
}

export default Partner_list;