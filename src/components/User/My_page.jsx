import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from './../../Services/user_api';
import Edit_profile from "./Edit_profile";
import "../../styles/My_page.css";

function My_page({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // 로그아웃 함수 추가! (에러 해결)
  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("정상적으로 로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패.");
    }
  };

  // 수정 완료 후 상태 초기화
  const handleSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return <Edit_profile user={user} onClose={() => setIsEditing(false)} onSuccess={handleSuccess} />;
  }

  return (
    <div className="signup-container">
      <div className="my-header-section">
        <h2 className="my-page-title">마이페이지</h2>
        <div className="alarm-icon">🔔</div>
      </div>

      <div className="profile-card">
        <h3 className="user-nickname">{user?.u_nickname || "사용자"}</h3>
        <p className="user-meta">@{user?.u_account || "아이디"} · 2024년 1월 가입</p>
        
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          ✏️ 프로필 수정
        </button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default My_page;