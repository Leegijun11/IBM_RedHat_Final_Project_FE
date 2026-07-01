import { useState } from "react";
import { updateBaby, uploadBabyImage } from "../../services/baby_api";
import "../../styles/baby_edit_profile.css"; // 🔥 스타일 파일 연결

function Edit_profile({ baby, onClose, onSuccess }) {
  const [b_name, setB_name] = useState(baby?.b_name || "");
  const [b_birth, setB_birth] = useState(baby?.b_birth || "");
  const [b_height, setB_height] = useState(baby?.b_height || "");
  const [b_weight, setB_weight] = useState(baby?.b_weight || "");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // 아이 정보 수정
  const handleUpdateBaby = async (e) => {
    e.preventDefault();

    try {
      let imagePath = baby?.b_image || null;

      if (imageFile) {
        const uploadResult = await uploadBabyImage(imageFile);
        imagePath = uploadResult.image_url;
      }

      const babyData = {
        b_name,
        b_birth,
        b_height: Number(b_height),
        b_weight: Number(b_weight),
        b_image: imagePath,
      };

      const result = await updateBaby(baby.b_id, babyData);
      console.log(result);

      alert("아이 정보를 수정하였습니다.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.log(error);
      alert("아이 정보 수정에 실패하였습니다.");
    }
  };

  return (
    <div className="baby-edit-dropdown">
      <h2 className="baby-edit-title">아이 정보 수정</h2>

      <form onSubmit={handleUpdateBaby} className="baby-edit-form">
        <div className="input-group">
          <label className="input-label">아이 이름</label>
          <input
            className="input-field"
            type="text"
            placeholder="아이 이름"
            value={b_name}
            onChange={(e) => setB_name(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">생년월일</label>
          <input
            className="input-field"
            type="date"
            value={b_birth}
            onChange={(e) => setB_birth(e.target.value)}
          />
        </div>

        <div className="input-group double-input">
          <div className="input-half">
            <label className="input-label">키 (cm)</label>
            <input
              className="input-field"
              type="number"
              placeholder="예: 65.0"
              value={b_height}
              onChange={(e) => setB_height(e.target.value)}
            />
          </div>
          <div className="input-half">
            <label className="input-label">몸무게 (kg)</label>
            <input
              className="input-field"
              type="number"
              placeholder="예: 7.2"
              value={b_weight}
              onChange={(e) => setB_weight(e.target.value)}
            />
          </div>
        </div>

        <div className="file-upload-group">
          <label className="input-label">아이 사진 변경</label>
          <input 
            className="file-input-field" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {imageFile && <p className="file-name-text">첨부됨: {imageFile.name}</p>}
        </div>

        <div className="btn-group">
          <button type="submit" className="submit-btn">수정하기</button>
          <button type="button" className="cancel-btn" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default Edit_profile;