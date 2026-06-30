import { getImageUrl } from "../../hooks/imageUrl";
import "../../styles/My_page.css";

function My_page({ user, onEditClick }) {
  return (
    <div className="mypage-header-section">
      <h2 className="mypage-title">마이페이지</h2>
      
      {user && (
        <div className="profile-header-content">
          <div className="profile-top-area">
            <div className="profile-img-wrapper">
              {user.u_image && (
                <img src={getImageUrl(user.u_image)} alt="프로필" className="profile-img" />
              )}
              <div className="camera-badge">📷</div>
            </div>

            <div className="profile-info-text">
              <h3 className="nickname">{user.u_nickname}</h3>
              <p className="real-name">{user.u_name}</p>
              <p className="account-info">아이디 : {user.u_account}</p>
              <p className="email-info">이메일 : {user.u_email}</p>
            </div>
          </div>
        </div>
      )}
      
      <button className="edit-btn" onClick={onEditClick}>✏️ 프로필 수정</button>
    </div>
  );
}

export default My_page;