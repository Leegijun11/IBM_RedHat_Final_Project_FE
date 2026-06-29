import { useState } from "react";
import "../../styles/Find_account.css"; // 디자인 스타일 재사용

function Find_password({ setPage }) {
    const [u_account, setU_account] = useState("");
    const [u_name, setU_name] = useState("");
    const [u_email, setU_email] = useState("");
    const [u_phone, setU_phone] = useState("");

    const handleFindPassword = (e) => {
        e.preventDefault();
        alert("비밀번호 찾기 기능은 아직 준비 중입니다.");
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
                    <h2 className="greeting-title">비밀번호 찾기</h2>
                    <p className="greeting-subtitle">본인 확인을 위해 정보를 입력해주세요</p>
                </div>

                <form onSubmit={handleFindPassword} className="login-form">
                    <div className="input-group">
                        <label className="signup-label">아이디</label>
                        <input className="signup-input" type="text" placeholder="아이디" value={u_account} onChange={(e) => setU_account(e.target.value)} />
                    </div>
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

                    <button type="submit" className="submit-btn">비밀번호 찾기</button>
                </form>

                <button className="back-to-login" onClick={() => setPage("login")}>
                    로그인으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default Find_password;