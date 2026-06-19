import { useState } from "react";
import { deletePartner } from "../../services/partnerApi";

function PartnerDelete() {
  const [uId, setUId] = useState("");

  const handleDelete = async () => {
    try {
      const result = await deletePartner(Number(uId));

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        placeholder="삭제할 유저 ID"
        value={uId}
        onChange={(e) => setUId(e.target.value)}
      />

      <button onClick={handleDelete}>
        공동 양육자 삭제
      </button>
    </div>
  );
}

export default PartnerDelete;