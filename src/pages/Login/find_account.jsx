import { useState } from "react";
import { findAccount } from "../../services/userApi";

function FindAccount() {
  const [data, setData] = useState({
    u_name: "",
    u_email: "",
    u_phone: "",
  });

  const handleFindAccount = async () => {
    try {
      const result = await findAccount(data);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleFindAccount}>
      아이디 찾기
    </button>
  );
}

export default FindAccount;