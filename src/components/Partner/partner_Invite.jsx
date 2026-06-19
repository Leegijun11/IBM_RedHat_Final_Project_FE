import { useState } from "react";
import { createPartner } from "../../services/partnerApi";

function PartnerInvite() {
  const [uId, setUId] = useState("");

  const handleInvite = async () => {
    try {
      const result = await createPartner(Number(uId));

      console.log(result);

      alert(result.msg);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        placeholder="유저 ID"
        value={uId}
        onChange={(e) => setUId(e.target.value)}
      />

      <button onClick={handleInvite}>
        공동 양육자 초대
      </button>
    </div>
  );
}

export default PartnerInvite;