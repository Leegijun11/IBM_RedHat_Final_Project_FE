import { useState } from "react";
import { findAccount } from "../../Services/user_api";

function Find_account ({setPage}) {
    const [u_name, setU_name] = useState("");
    const [u_email, setU_email] = useState("");
    const [u_phone, setU_phone] = useState("");
    const [ u_account, setU_account] = useState("");

    // 아이디 찾기
  const handleFindAccount = async (e) => {
    e.preventDefault();

    try {
      const result = await findAccount({ u_name, u_email, u_phone, });

      console.log(result);

      setU_account(result.u_account);

      alert("아이디를 찾았습니다.");

    } catch (error) {
      console.log(error);

      alert( "입력하신 정보와 일치하는 회원 정보를 찾을 수 없습니다." );
    }
  };

  return (
    <div>
      <h2>아이디 찾기</h2>

      <form onSubmit={handleFindAccount}>

        <div>
          <input type="text" placeholder="이름" value={u_name} onChange={(e) => setU_name(e.target.value)} />
        </div>

        <div>
          <input type="email" placeholder="이메일" value={u_email} onChange={(e) => setU_email(e.target.value)}/>
        </div>

        <div>
          <input type="text" placeholder="전화번호" value={u_phone} onChange={(e) => setU_phone(e.target.value)}/>
        </div>

        <button type="submit">아이디 찾기</button>
      </form>

      {u_account && (
        <div>
          <h3>조회 결과</h3>

          <p>아이디 : {u_account}</p>

        </div>
      )}

      <button onClick={() => setPage("login")}>로그인으로 돌아가기</button>
    </div>
  );
}

export default Find_account;
