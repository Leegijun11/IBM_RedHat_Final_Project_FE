import { useState } from "react";
import { signupUser } from "../../Services/user_api";

function Sign_up({ setPage }) {
    const [u_account,setU_account] = useState("");
    const [u_pw, setU_pw] = useState("");
    const [confirm_pw, setConfirm_pw] = useState ("");
    const [u_name, setU_name] = useState ("");
    const [u_nickname, setU_nicknameU] = useState ("");
    const [u_email, setU_email] = useState ("");
    const [u_phone, setU_phone] = useState ("");

    //회원가입
    const handleSignup = async (e) => {
        e.preventDefault();

        if (u_pw !== confirm_pw) {

            alert("비밀번호가 일치하지 않습니다.");

            return;
        }

        try {
            const result = await signupUser({u_account, u_pw, u_name, u_nickname, u_email, u_phone});

            console.log(result);

            alert(`${u_nickname}님 회원가입을 환영합니다.`);

            setPage("login");
        } catch (error) {
            console.log(error);

            alert("회원가입에 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>회원가입</h2>

            <form onSubmit={handleSignup}>
                <div>
                    <input type="text" placeholder="아이디" value={u_account} onChange={(e) => setU_account(e.target.value)} />

                    <input type="password" placeholder="비밀번호" value={u_pw} onChange={(e) => setU_pw(e.target.value)} />

                    <input type="password" placeholder="비밀번호 확인" value={confirm_pw} onChange={(e) => setConfirm_pw(e.target.value)} />

                    <input type="text" placeholder="이름" value={u_name} onChange={(e) => setU_name(e.target.value)} />

                    <input type="text" placeholder="닉네임" value={u_nickname} onChange={(e) => setU_nicknameU(e.target.value)} />

                    <input type="email" placeholder="이메일" value={u_email} onChange={(e) => setU_email(e.target.value)} />

                    <input type="text" placeholder="전화번호" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />
                </div>

                <button type="submit">회원가입</button>
            </form>

            <button onClick={() => setPage("login")}>로그인으로 돌아가기</button>
        </div>
    );
}

export default Sign_up;