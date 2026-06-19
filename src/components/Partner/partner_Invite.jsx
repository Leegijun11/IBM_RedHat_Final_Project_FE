import { useState } from "react";
import { createPartner } from "../../services/Partner_api";

function Partner_invite() {
  const [u_id, setU_id] = useState("");

  // 공동 양육자 초대
  const handlCretePartner = async (e) => {
    e.preventDefault();

    try {
      const result = await createPartner({u_id});

      console.log(result);

      alert("공동 양육자를 초대하였습니다.");

    } catch (error) {
      console.log(error);

      alert("공동 양육자 초대에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>공동 양육자 초대</h2>

      <form onSubmit={handlCretePartner}>
        <input type="numbr" placeholder="유저 ID" value={u_id} onChange={(e) => setU_id(e.target.value)} />

        <button type="submit">초대하기</button>
      </form>
    </div>
  );
}

export default Partner_invite;