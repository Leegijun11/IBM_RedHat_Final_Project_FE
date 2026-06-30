import { useState } from "react";
import { getUserById } from "../../Services/user_api";

function Other_user() {
    const [u_id, setU_id] = useState("");
    const [user, setUser] = useState(null);

    // 다른 유저 정보
    const handleGetUserById = async ( ) => {

        try {
            const result = await getUserById(u_id);

            console.log(result);

            setUser(result);
        } catch (error) {
            console.log(error);

            alert ("유저 정보 조회 실패.");
        }
    };

    return (

        <div>
            <h2>다른 유저 정보 조회</h2>

            <input type="number" placeholder="유저 ID" value={u_id} onChange={(e) => setU_id(e.target,value)} />

            <button onClick={handleGetUserById}>조회</button>

            {suer && (
                <div>
                    <p>아이디 : {user.u_accout} </p>

                    <p>닉네임 : {user.u_nickname} </p>

                    <p>가입일 : {user.u_created_at} </p>
                </div>
            )}
        </div>
    );
}

export default Other_user;