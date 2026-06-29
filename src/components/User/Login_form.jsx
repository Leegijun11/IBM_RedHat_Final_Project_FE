import { useState } from "react";
import { loginUser } from "../../Services/user_api";
import { getBabies } from "../../Services/baby_api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/Login_form.css"; // 🔥 CSS 연결

function Login_form({ setPage }) {
  const [u_account, setU_account] = useState("");
  const [u_pw, setU_pw] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        u_account,
        u_pw,
      });

      console.log("로그인 응답", result);

      login(result); // localStorage 없이 메모리(state)에만 저장

      try {
        const babies = await getBabies();
        if (babies && babies.length > 0) {
          navigate("/home");
        } else {
          navigate("/babyinfo");
        }
      } catch (babyError) {
        navigate("/babyinfo");
      }
    } catch (error) {
      console.log(error);
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="signup-container">
      {/* 배경 장식 원형 */}
      <div className="bg-circle circle-left"></div>
      <div className="bg-circle circle-right"></div>

      {/* 헤더: 로고 및 타이틀 */}
      <div className="header-section">
        <div className="logo-box">
          <span className="logo-icon">👶</span>
        </div>
        <h1 className="app-title">그로우</h1>
      </div>

      {/* 하단 흰색 시트 영역 */}
      <div className="bottom-sheet">
        
        {/* 로그인 / 회원가입 탭 (기존 회원가입 버튼 기능 연결) */}
        <div className="tab-switcher">
          <button className="tab-btn active" type="button">로그인</button>
          <button className="tab-btn" type="button" onClick={() => setPage("signup")}>회원가입</button>
        </div>

        {/* 환영 인사 */}
        <div className="greeting-box">
          <h2 className="greeting-title">다시 만나요! 👋</h2>
          <p className="greeting-subtitle">계정으로 로그인하세요</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* 아이디 입력 */}
          <div className="input-group">
            <label className="input-label">아이디</label>
            <div className="input-wrapper">
              <span className="icon-left">👤</span>
              <input
                type="text" 
                className="custom-input"
                placeholder="아이디를 입력하세요" 
                value={u_account} 
                onChange={(e) => setU_account(e.target.value)} 
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="input-group">
            <label className="input-label">비밀번호</label>
            <div className="input-wrapper">
              <span className="icon-left">🔑</span>
              <input 
                type="password" 
                className="custom-input"
                placeholder="비밀번호를 입력하세요" 
                value={u_pw} 
                onChange={(e) => setU_pw(e.target.value)} 
              />
            </div>
          </div>

          <div className="find-links-row">
            <button type="button" className="find-link" onClick={() => setPage("findAccount")}>
              아이디를 잊으셨나요?
            </button>
            <span className="link-divider">|</span>
            <button type="button" className="find-link" onClick={() => setPage("findPassword")}>
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 제출 버튼 */}
          <button type="submit" className="submit-btn">
            로그인
          </button>
        </form>

        {/* '또는' 구분선 */}
        <div className="divider-row">
          <div className="divider-line"></div>
          <span className="divider-text">또는</span>
          <div className="divider-line"></div>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="social-login-row">
          <button type="button" className="social-btn kakao">카카오</button>
          <button type="button" className="social-btn google">구글</button>
          <button type="button" className="social-btn apple">애플</button>
        </div>

      </div>
    </div>
  );
}

export default Login_form;