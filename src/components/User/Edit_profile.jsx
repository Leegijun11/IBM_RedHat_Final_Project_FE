import { useState, useEffect } from "react";
import { updateUser, uploadUserImage } from "../../services/user_api";
import { fetchMyProfilePhotoBlob } from "../../services/secureimages_api";
import "../../styles/Edit_profile.css";

function Edit_profile({ user, onClose, onSuccess }) {
  const [u_pw, setU_pw] = useState("");
  const [u_name, setU_name] = useState(user?.u_name || "");
  const [u_nickname, setU_nickname] = useState(user?.u_nickname || "");
  const [u_email, setU_email] = useState(user?.u_email || "");
  const [u_phone, setU_phone] = useState(user?.u_phone || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ★ 변경 포인트: user.u_image 값을 그대로 background-image에 박아 넣던 방식 대신,
  //   인증된 요청(fetchMyProfilePhotoBlob)으로 기존 사진을 가져와 미리보기로 사용
  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    const loadExistingImage = async () => {
      if (!user?.u_image) return;
      try {
        const url = await fetchMyProfilePhotoBlob();
        if (!cancelled) {
          objectUrl = url;
          setPreviewUrl(url);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadExistingImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user]);

  // 회원가입 로직 그대로
  const isLengthValid = u_pw.length >= 8;
  const hasNumber = /\d/.test(u_pw);
  const hasSpecial = /[@$!%*#?&]/.test(u_pw);
  const isPasswordValid = isLengthValid && hasNumber && hasSpecial;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // 비밀번호를 입력한 경우에만 검증 (빈 값이면 "변경 안 함"으로 간주)
    if (u_pw && !isPasswordValid) {
      alert("비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다.");
      return;
    }

    try {
      let imagePath = user?.u_image || null;
      if (imageFile) {
        const uploadResult = await uploadUserImage(imageFile);
        imagePath = uploadResult.image_url;
      }

      // u_pw가 빈 값이면 아예 전송 데이터에서 제외 (백엔드 model_dump(exclude_unset=True)와 맞춤)
      const payload = { u_name, u_nickname, u_email, u_phone, u_image: imagePath };
      if (u_pw) payload.u_pw = u_pw;

      await updateUser(payload);
      alert("정보를 수정하였습니다.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        alert(detail.map((d) => d.msg.replace(/^Value error,\s*/, "")).join("\n"));
      } else if (typeof detail === "string") {
        alert(detail);
      } else {
        alert("정보 수정에 실패하였습니다.");
      }
    }
  };

  return (
    <div className="profile-edit-dropdown">
      <form onSubmit={handleUpdateUser} className="edit-form">
        <div className="profile-image-section">
          <label htmlFor="profile-upload" className="image-label">
            <div className="image-circle" style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}} />
            <div className="camera-icon">📷</div>
          </label>
          <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>

        <label className="input-label">비밀번호 변경</label>
        <input className="input-field" type="password" placeholder="새 비밀번호를 입력하세요" value={u_pw} onChange={(e) => setU_pw(e.target.value)} />

        {/* 회원가입과 동일한 실시간 조건 체크 UI */}
        {u_pw && (
          <ul className="milestone-list">
            <li className={isLengthValid ? "valid" : "invalid"}>{isLengthValid ? "✓" : "✕"} 8자 이상</li>
            <li className={hasNumber ? "valid" : "invalid"}>{hasNumber ? "✓" : "✕"} 숫자 포함</li>
            <li className={hasSpecial ? "valid" : "invalid"}>{hasSpecial ? "✓" : "✕"} 특수문자 포함</li>
          </ul>
        )}

        <label className="input-label">이름</label>
        <input className="input-field" type="text" value={u_name} onChange={(e) => setU_name(e.target.value)} />

        <label className="input-label">닉네임</label>
        <input className="input-field" type="text" value={u_nickname} onChange={(e) => setU_nickname(e.target.value)} />

        <label className="input-label">이메일</label>
        <input className="input-field" type="email" value={u_email} onChange={(e) => setU_email(e.target.value)} />

        <label className="input-label">전화번호</label>
        <input className="input-field" type="text" value={u_phone} onChange={(e) => setU_phone(e.target.value)} />

        <div className="btn-group">
          <button type="submit" className="edit-profile-submit-btn">수정 완료</button>
          <button type="button" className="edit-profile-cancel-btn" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default Edit_profile;