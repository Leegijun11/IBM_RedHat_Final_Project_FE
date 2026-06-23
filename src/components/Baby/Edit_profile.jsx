import { useState } from "react";
import { updateBaby } from "../../services/baby_api";

function Edit_profile({ baby, onClose, onSuccess }) {
  const [b_name, setB_name] = useState(baby?.b_name || "");
  const [b_birth, setB_birth] = useState(baby?.b_birth || "");
  const [b_height, setB_height] = useState(baby?.b_height || "");
  const [b_weight, setB_weight] = useState(baby?.b_weight || "");
  const [b_image, setB_image] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setB_image(file);
    }
  };

  // 아이 정보 수정
  const handleUpdateBaby = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("b_id", baby.b_id);
      formData.append("b_name", b_name);
      formData.append("b_birth", b_birth);
      formData.append("b_height", b_height);
      formData.append("b_weight", b_weight);
      if (b_image) {
        formData.append("b_image", b_image);
      }

      const result = await updateBaby(formData);

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
    <div>
      <h2>아이 정보 수정</h2>

      <form onSubmit={handleUpdateBaby}>
        <div>
          <input
            type="text"
            placeholder="아이 이름"
            value={b_name}
            onChange={(e) => setB_name(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            value={b_birth}
            onChange={(e) => setB_birth(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="키 (cm)"
            value={b_height}
            onChange={(e) => setB_height(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="몸무게 (kg)"
            value={b_weight}
            onChange={(e) => setB_weight(e.target.value)}
          />
        </div>

        <div>
          <label>아이 사진 변경</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {b_image && <p>{b_image.name}</p>}
        </div>

        <button type="submit">수정하기</button>
        <button type="button" onClick={onClose}>취소</button>
      </form>
    </div>
  );
}

export default Edit_profile;