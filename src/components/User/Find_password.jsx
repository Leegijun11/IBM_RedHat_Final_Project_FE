import { useState } from "react";
import { findPassword } from "../../Services/user_api";

function Find_password ({ setPage }) {
    const [u_account, setU_account] = useState("");
    const [u_name, setU_name] = useState("");
    const [u_email, setU_email] =useState("");
    const [u_phone, setU_phone] = useState("");

    // 비밀번호 찾기
    const handleFindPassword = async (e) => {
        e.preventDefault();

        try {
            const result = await findPassword ({u_account, u_name, u_email, u_phone});

            console.log(result);

            alert("비밀번호 변경 링크가 귀하의 이메일로 전송되었습니다.");

        } catch (error) {
            console.log(error);

            alert("입력하신 정보와 일치하는 회원 정보를 찾을 수 없습니다.");
        }
    };

return (
    <div>
        <h2>비밀번호 찾기</h2>

        <form onSubmit={handleFindPassword}>
            <div>
                <input type="text" placeholder="아이디" value={u_account} onChange={(e) => setU_account(e.target.value)} />
            </div>

            <div>
                <input type="text" placeholder="이름" value={u_name} onChange={(e) => setU_name(e.target.value)} />
            </div>

            <div>
                <input type="email" placeholder="이메일" value={u_email} onChange={(e) => setU_email(e.target.value)} />
            </div>

            <div>
                <input type="text" placeholder="전화번호" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />
            </div>

            <button type="submit">비밀번호 찾기</button>
        </form>

        <button onClick={() => setPage("login")}>로그인으로 돌아가기</button>
    </div>
    );
}

export default Find_password;

