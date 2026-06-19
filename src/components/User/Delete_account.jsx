import { useState } from "react";
import { deleteUser } from "../../services/user_api";

function Delete_account () {
  const [u_id, setU_id] = useState("");

  // 유저 삭제
  const handleDeleteUser = async () => {
    const isConfirmed = window.confirm("정말 탈퇴하시겠습니까?");

    if(!isConfirmed) {
      return;
    }

    try {
      const result =await deleteUser(u_id);

      console.log(result);

      alert("회원 탈퇴가 완료되었습니다.");

    } catch (error) {
      console.log(error);

      alert("회원 탈퇴에 실패하였습니다.")
    }
  };

  return (
    <div>
      <h2>회원 탈퇴</h2>

      <div>
        <input type="number" placeholder="유저 ID" value={u_id} onChange={(e) => setU_id(e.target.value)} />
      </div>

      <button onClick={handleDeleteUser}>회원 탈퇴</button>
    </div>
  );
}

export default Delete_account;