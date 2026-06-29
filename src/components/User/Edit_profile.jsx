import { useState } from "react";
import { updateUser, uploadUserImage } from "../../services/user_api";
import "../../styles/Edit_profile.css"; // 🔥 CSS 연결

function Edit_profile({ user, onClose, onSuccess }) {
  const [u_pw, setU_pw] = useState("");
  const [u_name, setU_name] = useState(user?.u_name || "");
  const [u_nickname, setU_nickname] = useState(user?.u_nickname || "");
  const [u_email, setU_email] = useState(user?.u_email || "");
  const [u_phone, setU_phone] = useState(user?.u_phone || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.u_image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      let imagePath = user?.u_image || null;
      if (imageFile) {
        const uploadResult = await uploadUserImage(imageFile);
        imagePath = uploadResult.image_url;
      }
      await updateUser({ u_pw, u_name, u_nickname, u_email, u_phone, u_image: imagePath });
      alert("정보를 수정하였습니다.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      alert("정보 수정에 실패하였습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div className="baby-header-section">
        <h1 className="baby-title">프로필 수정</h1>
      </div>

      <div className="baby-bottom-sheet">
        <form onSubmit={handleUpdateUser} className="baby-form">
          {/* 프로필 사진 수정 */}
          <div className="baby-profile-section">
            <label htmlFor="profile-upload" className="baby-image-label">
              <div className="baby-image-circle" style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}} />
              <div className="camera-icon">📷</div>
            </label>
            <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </div>

          <label className="signup-label">비밀번호 변경</label>
          <input className="signup-input" type="password" placeholder="새 비밀번호를 입력하세요" value={u_pw} onChange={(e) => setU_pw(e.target.value)} />

          <label className="signup-label">이름</label>
          <input className="signup-input" type="text" value={u_name} onChange={(e) => setU_name(e.target.value)} />

          <label className="signup-label">닉네임</label>
          <input className="signup-input" type="text" value={u_nickname} onChange={(e) => setU_nickname(e.target.value)} />

          <label className="signup-label">이메일</label>
          <input className="signup-input" type="email" value={u_email} onChange={(e) => setU_email(e.target.value)} />

          <label className="signup-label">전화번호</label>
          <input className="signup-input" type="text" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />

          <button type="submit" className="submit-btn">수정 완료</button>
          <button type="button" className="skip-btn" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default Edit_profile;