import { useState } from "react";
import { signupUser, uploadUserImage } from "../../Services/user_api";
import "../../styles/Sign_up.css";

function Sign_up({ setPage }) {
    const [u_account, setU_account] = useState("");
    const [u_pw, setU_pw] = useState("");
    const [confirm_pw, setConfirm_pw] = useState("");
    const [u_name, setU_name] = useState("");
    const [u_nickname, setU_nicknameU] = useState("");
    const [u_email, setU_email] = useState("");
    const [u_phone, setU_phone] = useState("");
    const [u_address, setU_address] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (u_pw !== confirm_pw) { alert("비밀번호가 일치하지 않습니다."); return; }
        if (!agreed) { alert("이용약관 및 개인정보 처리방침에 동의해주세요."); return; }
        try {
            let imagePath = null;
            if (imageFile) {
                const uploadResult = await uploadUserImage(imageFile);
                imagePath = uploadResult.image_url;
            }
            const result = await signupUser({
                u_account, u_pw, u_name, u_nickname, u_email, u_phone, u_address, u_image: imagePath,
            });
            alert(`${u_nickname}님 회원가입을 환영합니다.`);
            setPage("login");
        } catch (error) {
            console.log(error);
            alert("회원가입에 실패하였습니다.");
        }
    };

    return (
        <div className="signup-container">
            {/* 배경 장식 */}
            <div className="bg-circle circle-left"></div>
            <div className="bg-circle circle-right"></div>

            {/* 💡 추가된 헤더 섹션 (로그인 창과 동일) */}
            <div className="header-section">
                <div className="logo-box">
                    <span className="logo-icon">👶</span>
                </div>
                <h1 className="app-title">그로우</h1>
            </div>

            {/* 바텀 시트 */}
            <div className="bottom-sheet">
                <div className="tab-switcher">
                    <button className="tab-btn" type="button" onClick={() => setPage("login")}>로그인</button>
                    <button className="tab-btn active" type="button">회원가입</button>
                </div>

                <div className="greeting-box">
                    <h2 className="greeting-title">함께 시작해요! 🌱</h2>
                    <p className="greeting-subtitle">새 계정을 만들어 아기의 성장을 기록하세요</p>
                </div>

                <form onSubmit={handleSignup}>
                    {/* 프로필 사진 */}
                    <div className="signup-image-wrapper">
                        <label htmlFor="profile-upload" className="signup-image-label">
                            <div className="signup-image-circle" style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}}>
                                {!previewUrl && <span className="signup-image-placeholder">👤</span>}
                            </div>
                            <span className="signup-image-camera">📷</span>
                        </label>
                        <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                        <p className="signup-image-hint">프로필 사진 추가</p>
                    </div>

                    <label className="signup-label">아이디</label>
                    <input className="signup-input" type="text" placeholder="영문, 숫자 조합 4~20자" value={u_account} onChange={(e) => setU_account(e.target.value)} />

                    <label className="signup-label">이름</label>
                    <input className="signup-input" type="text" placeholder="이름을 입력하세요" value={u_name} onChange={(e) => setU_name(e.target.value)} />

                    <label className="signup-label">닉네임</label>
                    <input className="signup-input" type="text" placeholder="앱에서 표시될 이름" value={u_nickname} onChange={(e) => setU_nicknameU(e.target.value)} />

                    <label className="signup-label">이메일</label>
                    <input className="signup-input" type="email" placeholder="이메일을 입력하세요" value={u_email} onChange={(e) => setU_email(e.target.value)} />

                    <label className="signup-label">전화번호</label>
                    <input className="signup-input" type="text" placeholder="전화번호를 입력하세요" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />

                    <label className="signup-label">주소</label>
                    <input className="signup-input" type="text" placeholder="주소를 입력하세요" value={u_address} onChange={(e) => setU_address(e.target.value)} />

                    <label className="signup-label">비밀번호</label>
                    <input className="signup-input" type="password" placeholder="비밀번호를 입력하세요" value={u_pw} onChange={(e) => setU_pw(e.target.value)} />

                    <label className="signup-label">비밀번호 확인</label>
                    <input className="signup-input" type="password" placeholder="비밀번호를 다시 입력하세요" value={confirm_pw} onChange={(e) => setConfirm_pw(e.target.value)} />

                    <div className="signup-agree-row">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <span><span className="signup-agree-link">이용약관 및 개인정보 처리방침</span>에 동의합니다</span>
                    </div>

                    <button type="submit" className="signup-submit-btn">회원가입 완료</button>
                </form>

                {/* <p className="signup-login-link">
                    이미 계정이 있으신가요? <span onClick={() => setPage("login")}>로그인</span>
                </p> */}
            </div>
        </div>
    );
}

export default Sign_up;