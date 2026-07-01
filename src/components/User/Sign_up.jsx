import { useState, useEffect } from "react";
import { signupUser, uploadUserImage } from "../../services/user_api";
import "../../styles/Sign_up.css";

function Sign_up({ setPage }) {
    const [u_account, setU_account] = useState("");
    const [u_pw, setU_pw] = useState("");
    const [confirm_pw, setConfirm_pw] = useState("");
    const [u_name, setU_name] = useState("");
    const [u_nickname, setU_nickname] = useState("");
    const [u_email, setU_email] = useState("");
    const [u_phone, setU_phone] = useState("");
    const [u_address, setU_address] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [agreed, setAgreed] = useState(false);
    
    // 실시간 에러 메시지 State
    const [errors, setErrors] = useState({
        u_account: "",
        u_name: "",
        u_nickname: "",
        u_email: "",
        u_phone: "",
        u_address: "",
        u_pw: "",
        confirm_pw: ""
    });

    // 사용자가 해당 입력창을 방문(포커스 아웃)했는지 여부 기록 State
    const [touched, setTouched] = useState({
        u_account: false,
        u_name: false,
        u_nickname: false,
        u_email: false,
        u_phone: false,
        u_address: false,
        u_pw: false,
        confirm_pw: false
    });

    // 비밀번호 보이기/숨기기 토글 State
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const isLengthValid = u_pw.length >= 8;
    const hasNumber = /\d/.test(u_pw);
    const hasSpecial = /[@$!%*#?&]/.test(u_pw);
    const isPasswordValid = isLengthValid && hasNumber && hasSpecial;

    let strengthText = "";
    let strengthColor = "";
    let strengthPercent = 0;

    if (u_pw.length > 0) {
        const hasUppercase = /[A-Z]/.test(u_pw);
        const isVeryLong = u_pw.length >= 12;

        if (!isPasswordValid) {
            strengthText = "가입 불가 🔴 (8자 이상, 숫자, 특수문자 필수)";
            strengthColor = "#ff4d4f";
            strengthPercent = 33;
        } else if (isPasswordValid && !hasUppercase && !isVeryLong) {
            strengthText = "보통 🟡";
            strengthColor = "#ffec3d";
            strengthPercent = 66;
        } else if (isPasswordValid && (hasUppercase || isVeryLong)) {
            strengthText = "안전 🟢";
            strengthColor = "#52c41a";
            strengthPercent = 100;
        }
    }

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // 실시간 유효성 검사 로직 
    useEffect(() => {
        const newErrors = {
            u_account: "", u_name: "", u_nickname: "", u_email: "", u_phone: "", u_address: "", u_pw: "", confirm_pw: ""
        };

        const accountRegex = /^(?=.*[a-zA-Z])[a-zA-Z\d]{4,20}$/;
        if (u_account && !accountRegex.test(u_account)) {
            newErrors.u_account = "아이디는 영문 필수, 숫자 선택 조합으로 4~20자 사이여야 합니다.";
        } 

        if (confirm_pw && u_pw !== confirm_pw) {
            newErrors.confirm_pw = "비밀번호가 일치하지 않습니다.";
        } 

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (u_email && !emailRegex.test(u_email)) {
            newErrors.u_email = "올바른 이메일 형식이 아닙니다.";
        } 

        const phoneRegex = /^010[0-9]{7,8}$/;
        if (u_phone && !phoneRegex.test(u_phone)) {
            newErrors.u_phone = "올바른 전화번호 형식(예: 010XXXXXXXX)이 아닙니다.";
        } 

        if (touched.u_name && !u_name.trim()) newErrors.u_name = "이름을 입력해주세요.";
        if (touched.u_nickname && !u_nickname.trim()) newErrors.u_nickname = "닉네임을 입력해주세요.";
        if (touched.u_address && !u_address.trim()) newErrors.u_address = "주소를 입력해주세요.";

       if (touched.u_pw && u_pw && !isPasswordValid) {
            newErrors.u_pw = "비밀번호 조건을 확인해주세요.";
        }

        setErrors(newErrors);
        
    }, [u_account, u_pw, confirm_pw, u_email, u_phone, u_name, u_nickname, 
        u_address, touched.u_name, touched.u_nickname, touched.u_address, 
        touched.u_pw, isPasswordValid]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setTouched({
            u_account: true, u_name: true, u_nickname: true, u_email: true, u_phone: true, u_address: true, u_pw: true, confirm_pw: true
        });

        const finalErrors = {};
        if (!u_account.trim()) finalErrors.u_account = "아이디를 입력해주세요.";
        if (!u_name.trim()) finalErrors.u_name = "이름을 입력해주세요.";
        if (!u_nickname.trim()) finalErrors.u_nickname = "닉네임을 입력해주세요.";
        if (!u_email.trim()) finalErrors.u_email = "이메일을 입력해주세요.";
        if (!u_phone.trim()) finalErrors.u_phone = "전화번호를 입력해주세요.";
        if (!u_address.trim()) finalErrors.u_address = "주소를 입력해주세요.";
        if (!confirm_pw.trim()) finalErrors.confirm_pw = "비밀번호를 입력해주세요.";

        if (!u_pw.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        
        if (!isPasswordValid) {
            alert("비밀번호 필수 조건을 만족하지 못했습니다. (8자 이상, 숫자 및 특수문자 조합)");
            return;
        }

        const hasFinalErrors = Object.keys(finalErrors).length > 0;
        const hasLiveErrors = Object.values(errors).some(msg => msg !== "");

        if (hasFinalErrors || hasLiveErrors) {
            setErrors(prev => ({ ...prev, ...finalErrors }));
            alert("미기입 항목 또는 입력 형식을 다시 확인해 주세요.");
            return;
        }   

        if (!agreed) {
            alert("이용약관 및 개인정보 처리방침에 동의해주세요.");
            return;
        }

        try {
            let imagePath = null;
            if (imageFile) {
                const uploadResult = await uploadUserImage(imageFile);
                imagePath = uploadResult.image_url;
            }

            await signupUser({
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
            <h2 className="signup-title">함께 시작해요! 🌱</h2>
            <p className="signup-subtitle">새 계정을 만들어 아기의 성장을 기록하세요</p>

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

                {/* 아이디 */}
                <label className="signup-label">아이디</label>
                <input
                    className={`signup-input ${touched.u_account && errors.u_account ? "input-error" : ""}`}
                    type="text"
                    placeholder="사용하실 아이디를 입력해주세요"
                    value={u_account}
                    onChange={(e) => setU_account(e.target.value)}
                    onBlur={() => handleBlur("u_account")} 
                />
                {touched.u_account && errors.u_account && <p className="error-text">{errors.u_account}</p>}

                {/* 이름 */}
                <label className="signup-label">이름</label>
                <input
                    className={`signup-input ${touched.u_name && errors.u_name ? "input-error" : ""}`}
                    type="text"
                    placeholder="실명을 입력해주세요"
                    value={u_name}
                    onChange={(e) => setU_name(e.target.value)}
                    onBlur={() => handleBlur("u_name")}
                />
                {touched.u_name && errors.u_name && <p className="error-text">{errors.u_name}</p>}
                
                {/* 닉네임 */}
                <label className="signup-label">닉네임</label>
                <input
                    className={`signup-input ${touched.u_nickname && errors.u_nickname ? "input-error" : ""}`}
                    type="text"
                    placeholder="사용하실 닉네임을 입력해주세요"
                    value={u_nickname}
                    onChange={(e) => setU_nickname(e.target.value)}
                    onBlur={() => handleBlur("u_nickname")}
                />
                {touched.u_nickname && errors.u_nickname && <p className="error-text">{errors.u_nickname}</p>}

                {/* 이메일 */}
                <label className="signup-label">이메일</label>
                <input
                    className={`signup-input ${touched.u_email && errors.u_email ? "input-error" : ""}`}
                    type="email"
                    placeholder="이메일 주소를 입력해주세요 (예: abc@gmail.com)"
                    value={u_email}
                    onChange={(e) => setU_email(e.target.value)}
                    onBlur={() => handleBlur("u_email")}
                />
                {touched.u_email && errors.u_email && <p className="error-text">{errors.u_email}</p>}

                {/* 전화번호 */}
                <label className="signup-label">전화번호</label>
                <input
                    className={`signup-input ${touched.u_phone && errors.u_phone ? "input-error" : ""}`}
                    type="text"
                    placeholder="전화번호를 입력해주세요 ('-' 제외 숫자만)"
                    value={u_phone}
                    onChange={(e) => setU_phone(e.target.value)}
                    onBlur={() => handleBlur("u_phone")}
                />
                {touched.u_phone && errors.u_phone && <p className="error-text">{errors.u_phone}</p>}

                {/* 주소 */}
                <label className="signup-label">주소</label>
                <input
                    className={`signup-input ${touched.u_address && errors.u_address ? "input-error" : ""}`}
                    type="text"
                    placeholder="거주하시는 주소를 입력해주세요"
                    value={u_address}
                    onChange={(e) => setU_address(e.target.value)}
                    onBlur={() => handleBlur("u_address")}
                />
                {touched.u_address && errors.u_address && <p className="error-text">{errors.u_address}</p>}

                {/* 비밀번호 */}
                <label className="signup-label">비밀번호</label>
                <div className="password-input-wrapper" style={{ position: "relative" }}>
                    <input
                        className={`signup-input ${touched.u_pw && !isPasswordValid && u_pw.length > 0 ? "input-error" : ""}`}
                        type={showPw ? "text" : "password"}
                        placeholder="비밀번호를 입력해주세요"
                        value={u_pw}
                        onChange={(e) => setU_pw(e.target.value)}
                        onBlur={() => handleBlur("u_pw")}
                        style={{ width: "100%" }}
                    />
                    <span className="password-toggle-icon" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "15px", top: "12px", cursor: "pointer" }}>
                        {showPw ? "👁️" : "👁️‍🗨️"}
                    </span>
                </div>

                {/* [추가 안내] 
                     비밀번호 입력 시 실시간 에러 클래스 및 텍스트 출력을 위해
                     input 태그 하단에 u_pw 에러 문구 노출 로직을 유지하거나 아래의 가이드라인을 타게 됩니다. */}
                {u_pw && (
                    <div className="password-strength-wrapper">
                        <div className="strength-bar-container">
                            <div className="strength-bar-fill" style={{ width: `${strengthPercent}%`, background: strengthColor }} />
                        </div>
                        <p className="strength-text">보안 강도: <b>{strengthText}</b></p>
                        <ul className="milestone-list">
                            <li className={isLengthValid ? "valid" : "invalid"}>{isLengthValid ? "✓" : "✕"} 8자 이상</li>
                            <li className={hasNumber ? "valid" : "invalid"}>{hasNumber ? "✓" : "✕"} 숫자 포함</li>
                            <li className={hasSpecial ? "valid" : "invalid"}>{hasSpecial ? "✓" : "✕"} 특수문자 포함</li>
                        </ul>
                    </div>
                )}

                {/* 비밀번호 확인 */}
                <label className="signup-label">비밀번호 확인</label>
                <div className="password-input-wrapper" style={{ position: "relative" }}>
                    <input
                        className={`signup-input ${touched.confirm_pw && errors.confirm_pw ? "input-error" : ""}`}
                        type={showConfirmPw ? "text" : "password"}
                        placeholder="비밀번호를 재입력해주세요"
                        value={confirm_pw}
                        onChange={(e) => setConfirm_pw(e.target.value)}
                        onBlur={() => handleBlur("confirm_pw")}
                        style={{ width: "100%" }}
                    />
                    <span className="password-toggle-icon" onClick={() => setShowConfirmPw(!showConfirmPw)} style={{ position: "absolute", right: "15px", top: "12px", cursor: "pointer" }}>
                        {showConfirmPw ? "👁️" : "👁️‍🗨️"}
                    </span>
                </div>
                {touched.confirm_pw && errors.confirm_pw && <p className="error-text">{errors.confirm_pw}</p>}

                <div className="signup-agree-row">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <span><span className="signup-agree-link">이용약관 및 개인정보 처리방침</span>에 동의합니다</span>
                </div>

                <button type="submit" className="signup-submit-btn">회원가입 완료</button>
            </form>

            <p className="signup-login-link">이미 계정이 있으신가요? <span onClick={() => setPage("login")}>로그인</span></p>
        </div>
    );
}

export default Sign_up;