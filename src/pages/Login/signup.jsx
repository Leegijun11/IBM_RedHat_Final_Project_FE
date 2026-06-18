import { useState } from "react";
import { signupUser } from "../../services/user_api";

function signup() {
    const [formData, setFormData] = useState({
        u_account : "",
        u_name : "",
        u_nickname : "",
        u_email : "",
        u_phone : "",
        u_pw : "",
        confirmpw : "",
        agree : false,
    });

const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSignup = async () => {
    try {
      const result = await signupUser({
        u_account: formData.u_account,
        u_name: formData.u_name,
        u_nickname: formData.u_nickname,
        u_email: formData.u_email,
        u_phone: formData.u_phone,
        u_pw: formData.u_pw,
      });

      console.log(result);
      alert("회원가입 성공");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleSignup}>
        회원가입
      </button>
    </div>
  );

}

export default signup;