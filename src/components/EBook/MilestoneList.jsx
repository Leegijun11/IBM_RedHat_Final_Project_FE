import React, { useState, useEffect } from "react";
import { getMilestones, checkMilestone } from "../../services/milestone_api";
import "../../styles/MilestoneList.css"; // 🔥 스타일 연결

function MilestoneList({ babyId, babyAgeMonths }) {
  const [milestones, setMilestones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "인지", "언어/의사소통", "신체 발달", "사회성/정서"];

  const getAgeRangeLabel = (months) => {
    if (months < 2) return "0~2개월";
    if (months < 4) return "2~4개월";
    if (months < 6) return "4~6개월";
    if (months < 9) return "6~9개월";
    if (months < 12) return "9~12개월";
    if (months < 24) return "12~24개월";
    if (months < 36) return "24~36개월";
    if (months < 48) return "36~48개월";
    if (months < 60) return "48~60개월";
    return "60개월 이상";
  };

  const getTargetAge = (months) => {
    if (months < 2) return 2;
    if (months < 4) return 4;
    if (months < 6) return 6;
    if (months < 9) return 9;
    if (months < 12) return 12;
    if (months < 24) return 24;
    if (months < 36) return 36;
    if (months < 48) return 48;
    return 60;
  };

  useEffect(() => {
    const targetAge = getTargetAge(babyAgeMonths);
    const fetchMilestones = async () => {
      try {
        const data = await getMilestones(targetAge, selectedCategory === "전체" ? "" : selectedCategory);
        setMilestones(data);
      } catch (error) {
        console.error("마일스톤 조회 실패:", error);
      }
    };
    fetchMilestones();
  }, [babyAgeMonths, selectedCategory]);

  return (
    <div className="milestone-container">
      <h4 className="milestone-title">발달 마일스톤 ({getAgeRangeLabel(babyAgeMonths)} 기준)</h4>
      
      <select 
        className="milestone-select" 
        onChange={(e) => setSelectedCategory(e.target.value)} 
        value={selectedCategory}
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      
        <ul className="milestone-list">
          {milestones.map((m) => (
            <li key={m.id} className={`milestone-item ${m.is_achieved ? 'achieved' : ''}`}>
              {/* 라벨로 감싸서 영역 전체 클릭 가능하게 설정 */}
              <label className="checkbox-wrapper">
                <input 
                    type="checkbox" 
                    checked={m.is_achieved} 
                    onChange={() => checkMilestone(babyId, m.id, !m.is_achieved)} 
                />
                {/* 이 span이 동그라미 역할을 합니다 */}
                <span className="custom-circle"></span>
                <span className="checkbox-text">{m.app_milestone}</span>
              </label>
            </li>
          ))}
        </ul>
    </div>
  );
}

export default MilestoneList;