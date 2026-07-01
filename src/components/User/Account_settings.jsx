import { useNavigate } from "react-router-dom";
import { logoutUser, deleteUser } from "../../services/user_api";
import "../../styles/Account_settings.css"; // 🔥 스타일 파일 연결

function Account_settings() {
  const navigate = useNavigate();

  // 로그아웃
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      console.log(result);

      alert("정상적으로 로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패.");
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {
    const check = window.confirm(
      "정말 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다."
    );

    if (!check) return;

    try {
      await deleteUser();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.detail || "회원 탈퇴에 실패하였습니다.";
      alert(message);
    }
  };

  return (
    <div className="account-settings-container">
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
      <button className="delete-btn" onClick={handleDeleteAccount}>
        회원 탈퇴
      </button>
    </div>
  );
}

export default Account_settings;