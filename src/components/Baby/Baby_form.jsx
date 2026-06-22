import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBaby } from "../../services/baby_api";
import { createBabyPersonality } from "../../services/baby_api";
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
  const [b_personality, setB_personality] = useState([]);

  const navigate = useNavigate();

  // 사진 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setB_image(file);
    }
  };

  // 성격 복수 선택 토글
  const togglePersonality = (option) => {
    setB_personality((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // 시작하기
  const handleStart = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();
        formData.append("b_name", b_name);
        formData.append("b_birth", b_birth);
        formData.append("b_height", b_height);
        formData.append("b_weight", b_weight);
        if (b_image) {
        formData.append("b_image", b_image);
        }

        // 1. 아기 기본 정보 등록
        const babyResult = await createBaby(formData);
        console.log(babyResult);
        const newBabyId = babyResult.b_id; // 응답 구조 확인 필요

        // 2. 성격 정보를 boolean으로 변환해서 등록
        if (b_personality.length > 0) {
        const personalityData = { b_id: newBabyId };
        PERSONALITY_OPTIONS.forEach((option) => {
            personalityData[option.key] = b_personality.includes(option.label);
        });

        await createBabyPersonality(personalityData);
        }

        navigate("/home");
    } catch (error) {
        console.log(error);
        alert("아기 정보 등록에 실패했습니다.");
    }
    };

  // 다음에 등록하기
  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div>
      <h2>아기 정보 입력</h2>

      <form onSubmit={handleStart}>
        <div>
          <input
            type="text"
            placeholder="아기 이름"
            value={b_name}
            onChange={(e) => setB_name(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            placeholder="생년월일"
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
          <label>아기 사진</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {b_image && <p>{b_image.name}</p>}
        </div>

        <hr />

        <div>
          <p>아기 성격 (복수 선택 가능)</p>
          {PERSONALITY_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.key}
              onClick={() => togglePersonality(option.label)}
              style={{
                fontWeight: b_personality.includes(option.label) ? "bold" : "normal",
                backgroundColor: b_personality.includes(option.label) ? "#ffd6e8" : "#fff",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <hr />

        <button type="submit">시작하기</button>
        <button type="button" onClick={handleSkip}>
          다음에 등록하기
        </button>
      </form>
    </div>
  );
}

export default Baby_form;