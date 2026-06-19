import { useEffect, useState } from "react";
import { getPartnerList, deletePartner } from "../../services/Partner_api";
import PartnerList from './partner_list';

function Partner_list() {
  const [u_id, setU_id] = useState("");
  const [PartnerList, setPartnerList] = useState ([]);

  // 공동 양육자 목록 조회
  const handleGetParrtnerList = async () => {

    try {

      const result = await getPartnerList({u_id});

    } catch (error) {
      console.log (error);

      alert("공동 양육자 목록을 불러오는데 실패하였습니다.");
    }
  };

  useEffect(() =>{

    if (u_id) {
      handleGetPartnerList();
    }
  }, [u_id]);

  // 공동 양육자 삭제
  const handleDeletepartner = async () => {

    try {

      await deletePartner({u_id});

      alert("공동 양육자 지정이 취소되었습니다.");

      handleGetParrtnerList();
    } catch (error) {
      console.log(error);

      alert("공동 양육자 지정 취소에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>공동 양육자 목록</h2>

      {PartnerList.map((Partner, index) => (
        <div key={index}>
          <p>이름 : {Partner.u_nanme}</p>

          <p>역할 : {Partner.u_p_role}</p>

          <p>관계 : {Partner.u_category}</p>

          <p>상태 : {Partner.u_state}</p>

          <button onChange={handleDeletepartner}>삭제</button>
        </div>
      ))}
    </div>
  );
}

export default Partner_list;