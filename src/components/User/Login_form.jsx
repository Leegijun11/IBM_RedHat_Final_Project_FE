import { useState } from "react";
import { loginUser } from "../../Services/user_api";

function Login_form({ setPage }) {
  const [u_account, setU_account] = useState("");
  const [u_pw, setU_pw] = useState("");

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        u_account, u_pw,
      });

      console.log(result);

      alert(`${result.u_name}님 환영합니다.`);

      // TODO
      // 아기 등록 여부 확인 후
      // Home 또는 Onboarding 이동

    } catch (error) {
      console.log(error);

      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input type="text" placeholder="아이디" value={u_account} onChange={(e) => setU_account(e.target.value)} />
        </div>

        <div>
          <input type="password" placeholder="비밀번호" value={u_pw} onChange={(e) => setU_pw(e.target.value)} />
        </div>

        <button type="submit">로그인</button>
      </form>

      <hr />

      {/* 회원가입 */}
      <button onClick={() => setPage("signup")}>
        회원가입
      </button>

      {/* 아이디 찾기 */}
      <button onClick={() => setPage("findAccount")}>
        아이디 찾기
      </button>

      {/* 비밀번호 찾기 */}
      <button onClick={() => setPage("findPassword")}>
        비밀번호 찾기
      </button>
    </div>
  );
}

export default Login_form;