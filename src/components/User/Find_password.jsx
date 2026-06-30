import { useState } from "react";
import { findPassword } from "../../services/user_api";

function Find_password({ setPage }) {
    const [u_account, setU_account] = useState("");
    const [u_name, setU_name] = useState("");
    const [u_email, setU_email] = useState("");
    const [u_phone, setU_phone] = useState("");
    const [loading, setLoading] = useState(false);

    // 비밀번호 찾기
    const handleFindPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await findPassword({
                u_account,
                u_name,
                u_email,
                u_phone,
            });

            console.log(result);
            alert(result.message || "임시 비밀번호가 이메일로 전송되었습니다.");
            setPage("login");
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.detail || "비밀번호 찾기에 실패하였습니다.";
            alert(message);
        } finally {
            setLoading(false);
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

                    {/* 중복된 버튼을 하나로 합치고 loading 상태 적용 */}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "처리 중..." : "비밀번호 찾기"}
                    </button>
                </form>

                <button className="back-to-login" onClick={() => setPage("login")}>
                    로그인으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default Find_password;