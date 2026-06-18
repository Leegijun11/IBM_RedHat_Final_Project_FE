import { useState } from "react";
import { loginUser } from "../../services/userApi";

function Login() {
  const [loginData, setLoginData] = useState({
    u_account: "",
    u_pw: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const result = await loginUser(loginData);

      console.log(result);

      localStorage.setItem(
        "user",
        JSON.stringify(result)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>
        로그인
      </button>
    </div>
  );
}

export default Login;