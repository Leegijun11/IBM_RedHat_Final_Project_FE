import React, { useState, useEffect } from "react";
import { getMilestones, checkMilestone } from "../../services/milestone_api";
import "../../styles/MilestoneList.css";

function MilestoneList({ babyId, babyAgeMonths }) {
  const [allMilestones, setAllMilestones] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "신체", "언어·인지", "사회·정서", "자조·독립"];

  const categoryMap = {
    "신체": ["신체·반사", "신체·소근육", "신체·대근육"],
    "언어·인지": ["언어·인지", "언어·소통", "인지·감각", "인지·소통", "인지·학습", "시각·감각", "구강·인지", "소통·인지", "소근육·행동"],
    "사회·정서": ["사회·정서", "사회성·정서", "사회성·모방", "사회·소통", "인지·정서"],
    "자조·독립": ["자조·독립"],
  };

  const ageBuckets = [2, 4, 6, 8, 10, 12, 18, 24, 36, 48, 60];

  const getAgeRangeLabel = (months) => {
    if (months < 2) return "0~2개월";
    if (months < 4) return "2~4개월";
    if (months < 6) return "4~6개월";
    if (months < 8) return "6~8개월";
    if (months < 10) return "8~10개월";
    if (months < 12) return "10~12개월";
    if (months < 18) return "12~18개월";
    if (months < 24) return "18~24개월";
    if (months < 36) return "24~36개월";
    if (months < 48) return "36~48개월";
    if (months < 60) return "48~60개월";
    return "60개월 이상";
  };

  const getTargetAge = (months) => {
    if (months < 2) return 2;
    if (months < 4) return 4;
    if (months < 6) return 6;
    if (months < 8) return 8;
    if (months < 10) return 10;
    if (months < 12) return 12;
    if (months < 18) return 18;
    if (months < 24) return 24;
    if (months < 36) return 36;
    if (months < 48) return 48;
    return 60;
  };

  const [currentBucket, setCurrentBucket] = useState(() => getTargetAge(babyAgeMonths));

  const handlePrevBucket = () => {
    const currentIndex = ageBuckets.indexOf(currentBucket);
    if (currentIndex > 0) {
      setCurrentBucket(ageBuckets[currentIndex - 1]);
    }
  };

  const handleNextBucket = () => {
    const currentIndex = ageBuckets.indexOf(currentBucket);
    if (currentIndex < ageBuckets.length - 1) {
      setCurrentBucket(ageBuckets[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await getMilestones(babyId,null, "", currentBucket);
        setAllMilestones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("마일스톤 조회 실패:", error);
        setAllMilestones([]);
      }
    };
    fetchMilestones();
  }, [babyId, currentBucket]); 

  useEffect(() => {
    if (selectedCategory === "전체") {
      setMilestones(allMilestones);
    } else {
      const filtered = allMilestones.filter(
        (m) => categoryMap[selectedCategory]?.includes(m.m_category)
      );
      setMilestones(filtered);
    }
  }, [selectedCategory, allMilestones]);

  const handleToggleCheck = async (m_id, currentStatus) => {
    setAllMilestones((prev) =>
      prev.map((m) => (m.m_id === m_id ? { ...m, is_achieved: !currentStatus } : m))
    );
    try {
      await checkMilestone(babyId, m_id, !currentStatus);
    } catch (error) {
      setAllMilestones((prev) =>
        prev.map((m) => (m.m_id === m_id ? { ...m, is_achieved: currentStatus } : m))
      );
      console.error("마일스톤 상태 변경 실패:", error);
    }
  };

  return (
    <div className="milestone-container">
      <div className="milestone-nav-wrapper">
        <button className="nav-arrow-btn" onClick={handlePrevBucket} disabled={currentBucket === 2}>‹</button>
      
        <h4 className="milestone-title">
          발달 마일스톤 ({getAgeRangeLabel(currentBucket - 1)} 기준)
        </h4>
      
        <button className="nav-arrow-btn" onClick={handleNextBucket} disabled={currentBucket === 60}>›</button>
      </div>

      <select
        className="milestone-select"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {milestones.length === 0 ? (
        <p className="milestone-empty">해당 항목이 없습니다.</p>
      ) : (
        <ul className="milestone-list">
          {milestones.map((m) => (
            <li key={m.m_id} className={`milestone-item ${m.is_achieved ? "achieved" : ""}`}>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={m.is_achieved}
                  onChange={() => handleToggleCheck(m.m_id, m.is_achieved)}
                />
                <span className="custom-circle"></span>
                <span className="checkbox-text">{m.app_milestone}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MilestoneList;