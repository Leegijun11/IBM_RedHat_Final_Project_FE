import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBaby, createBabyPersonality, uploadBabyImage } from "../../services/baby_api";
import "../../styles/Baby_form.css"; 

const PERSONALITY_OPTIONS = [
  { label: "활발해요", key: "c_active" },
  { label: "호기심왕", key: "c_curiosity" },
  { label: "수줍음쟁이", key: "c_shy" },
  { label: "먹보", key: "c_eater" },
  { label: "잠꾸러기", key: "c_sleepy" },
  { label: "애교쟁이", key: "c_charm" },
];

function Baby_form() {
  const [b_name, setB_name] = useState("");
  const [b_birth, setB_birth] = useState("");
  const [b_height, setB_height] = useState("");
  const [b_weight, setB_weight] = useState("");
  const [b_image, setB_image] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [b_personality, setB_personality] = useState([]);
  const [b_gender, setB_gender] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setB_image(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const togglePersonality = (option) => {
    setB_personality((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      let imagePath = null;
      if (b_image) {
        const uploadResult = await uploadBabyImage(b_image);
        imagePath = uploadResult.image_url;
      }
      const babyData = { b_name, b_birth, b_height: Number(b_height), b_weight: Number(b_weight), b_gender, b_image: imagePath };
      const babyResult = await createBaby(babyData);
      if (b_personality.length > 0) {
        const personalityData = { b_id: babyResult.b_id };
        PERSONALITY_OPTIONS.forEach((opt) => personalityData[opt.key] = b_personality.includes(opt.label));
        await createBabyPersonality(personalityData);
      }
      navigate("/home");
    } catch (error) {
      alert("아기 정보 등록에 실패했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div className="baby-header-section">
        <p className="baby-sub-title">우리 아기를 소개해주세요</p>
        <h1 className="baby-title">아기 정보<br/>입력하기</h1>
      </div>

      <div className="baby-bottom-sheet">
        <div className="baby-profile-section">
          <label htmlFor="baby-upload" className="baby-image-label">
            <div className="baby-image-circle" style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}}>
              {!previewUrl && (
                <>
                  <span className="placeholder-icon">👶</span>
                  <span className="placeholder-text">사진 없음</span>
                </>
              )}
            </div>
            <div className="camera-icon">📷</div>
          </label>
          <input id="baby-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </div>
    
        <form onSubmit={handleStart} className="baby-form">
          <label className="signup-label">아기 이름</label>
          <input className="signup-input" type="text" placeholder="예) 박지수" value={b_name} onChange={(e) => setB_name(e.target.value)} />

          <label className="signup-label">생년월일</label>
          <input className="signup-input" type="date" value={b_birth} onChange={(e) => setB_birth(e.target.value)} />

          <div className="row-inputs">
            <div className="input-group half">
              <label className="signup-label">키 (cm)</label>
              <input className="signup-input" type="number" placeholder="예) 65.0" value={b_height} onChange={(e) => setB_height(e.target.value)} />
            </div>
            <div className="input-group half">
              <label className="signup-label">몸무게 (kg)</label>
              <input className="signup-input" type="number" placeholder="예) 7.2" value={b_weight} onChange={(e) => setB_weight(e.target.value)} />
            </div>
          </div>

          <label className="signup-label">성별</label>
          <select className="signup-input" value={b_gender} onChange={(e) => setB_gender(e.target.value)}>
            <option value="">선택하세요</option>
            <option value="M">남자</option>
            <option value="F">여자</option>
          </select>

          <label className="signup-label">아기의 성격 (복수 선택)</label>
          <div className="personality-grid">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.key}
                className={`personality-btn ${b_personality.includes(opt.label) ? "active" : ""}`}
                onClick={() => togglePersonality(opt.label)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button type="submit" className="submit-btn">시작하기 →</button>
          <button type="button" className="skip-btn" onClick={() => navigate("/home")}>다음에 등록하기</button>
        </form>
      </div>
    </div>
  );
}

export default Baby_form;