import { useState } from "react";
import { findAccount } from "../../services/user_api";
import "../../styles/Find_account.css";

function Find_account({ setPage }) {
  const [u_name, setU_name] = useState("");
  const [u_email, setU_email] = useState("");
  const [u_phone, setU_phone] = useState("");
  const [u_account, setU_account] = useState("");

  const handleFindAccount = async (e) => {
    e.preventDefault();
    try {
      const result = await findAccount({ u_name, u_email, u_phone });
      setU_account(result.u_account);
      alert("아이디를 찾았습니다.");
    } catch (error) {
      alert("입력하신 정보와 일치하는 회원 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div className="bg-circle circle-left"></div>
      <div className="bg-circle circle-right"></div>

      <div className="header-section">
        <div className="logo-box">
          <span className="logo-icon">👶</span>
        </div>
        <h1 className="app-title">그로우</h1>
      </div>

      <div className="bottom-sheet">
        <div className="greeting-box">
          <h2 className="greeting-title">아이디 찾기</h2>
          <p className="greeting-subtitle">가입 시 입력한 정보를 입력해주세요</p>
        </div>

        <form onSubmit={handleFindAccount} className="login-form">
          <div className="input-group">
            <label className="signup-label">이름</label>
            <input className="signup-input" type="text" placeholder="이름" value={u_name} onChange={(e) => setU_name(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="signup-label">이메일</label>
            <input className="signup-input" type="email" placeholder="이메일" value={u_email} onChange={(e) => setU_email(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="signup-label">전화번호</label>
            <input className="signup-input" type="text" placeholder="전화번호" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />
          </div>

          <button type="submit" className="submit-btn">아이디 찾기</button>
        </form>

        {u_account && (
          <div className="result-box">
            <p className="result-label">조회된 아이디</p>
            <h3 className="result-value">{u_account}</h3>
          </div>
        )}

        <button className="back-to-login" onClick={() => setPage("login")}>
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Find_account;