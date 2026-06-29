import { useState } from "react";
import { updateUser, uploadUserImage } from "../../services/user_api";

function Edit_profile({ user, onClose, onSuccess }) {
  const [u_pw, setU_pw] = useState("");
  const [u_name, setU_name] = useState(user?.u_name || "");
  const [u_nickname, setU_nickname] = useState(user?.u_nickname || "");
  const [u_email, setU_email] = useState(user?.u_email || "");
  const [u_phone, setU_phone] = useState(user?.u_phone || "");
  const [imageFile, setImageFile] = useState(null);

  // 유저 정보 수정
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      let imagePath = user?.u_image || null;

      if (imageFile) {
        const uploadResult = await uploadUserImage(imageFile);
        imagePath = uploadResult.image_url;
      }

      const result = await updateUser({
        u_pw,
        u_name,
        u_nickname,
        u_email,
        u_phone,
        u_image: imagePath,
      });

      console.log(result);

      alert("정보를 수정하였습니다.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.log(error);
      alert("정보 수정에 실패하였습니다.");
    }
  };

  return (
    <div>
      <h2>프로필 수정</h2>

      <form onSubmit={handleUpdateUser}>
        <div>
          <label>프로필 사진 변경</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile && <p>{imageFile.name}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={u_pw}
            onChange={(e) => setU_pw(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="이름"
            value={u_name}
            onChange={(e) => setU_name(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="닉네임"
            value={u_nickname}
            onChange={(e) => setU_nickname(e.target.value)}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="이메일"
            value={u_email}
            onChange={(e) => setU_email(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="전화번호"
            value={u_phone}
            onChange={(e) => setU_phone(e.target.value)}
          />
        </div>

        <button type="submit">수정하기</button>
        <button type="button" onClick={onClose}>취소</button>
      </form>
    </div>
  );
}

export default Edit_profile;