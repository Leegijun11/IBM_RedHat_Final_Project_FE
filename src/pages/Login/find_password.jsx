import { useState } from "react";
import { findPassword } from "../../services/userApi";

function FindPassword() {
  const [data, setData] = useState({
    u_account: "",
    u_name: "",
    u_email: "",
    u_phone: "",
  });

  const handleFindPassword = async () => {
    try {
      const result = await findPassword(data);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleFindPassword}>
      비밀번호 찾기
    </button>
  );
}

export default FindPassword;