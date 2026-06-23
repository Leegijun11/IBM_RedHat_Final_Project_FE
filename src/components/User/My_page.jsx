import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from './../../services/user_api';

function My_page({ user }) {
  const { my_id, logout } = useAuth();
  const navigate = useNavigate();

  // 로그아웃
  const handleLogout = async () => {
    try {
      const result = await logoutUser(my_id);
      console.log(result);

      logout(); // localStorage에서 u_id 삭제
      alert("정상적으로 로그아웃 되었습니다.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패.");
    }
  };

  return (
    <div>
      <h2>마이페이지</h2>

      {user && (
        <>
          <p>아이디 : {user.u_account}</p>
          <p>이름 : {user.u_name}</p>
          <p>닉네임 : {user.u_nickname}</p>
          <p>이메일 : {user.u_email}</p>
          <p>전화번호 : {user.u_phone}</p>
        </>
      )}

      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default My_page;