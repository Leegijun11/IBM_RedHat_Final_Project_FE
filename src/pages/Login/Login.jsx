import { useState } from "react";

import Login_form from "../../components/User/Login_form";
import Sign_up from "../../components/User/Sign_up";
import Find_account from "../../components/User/Find_account";
import Find_password from "../../components/User/Find_password";


function Login() {
  const [page, setPage] = useState("login");

  return (
    <>
      {/* 로그인 */}
      {page === "login" && (
        <Login_form setPage={setPage} />
      )}

      {/* 회원가입 */}
      {page === "signup" && (
        <Sign_up setPage={setPage} />
      )} 

      {/* 아이디 찾기 */}
      {page === "findAccount" && (
        <Find_account setPage={setPage} />
      )}

      {/* 비밀번호 찾기 */}
      {page === "findPassword" && (
        <Find_password setPage={setPage} />
      )}
    </>
  );
}

export default Login;