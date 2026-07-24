import SecureMyProfileImage from "../common/Securemyprofileimage";
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
                <SecureMyProfileImage
                  hasImage={!!user.u_image}
                  alt="프로필"
                  className="profile-img"
                />
              )}
              <div className="camera-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
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
      
      <button className="edit-btn" onClick={onEditClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#000000", marginRight: "6px", flexShrink: 0 }}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      <span>프로필 수정</span>
    </button>
    </div>
  );
}

export default My_page;