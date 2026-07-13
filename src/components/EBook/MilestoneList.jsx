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
        const data = await getMilestones(babyId, targetAge, "");
        setAllMilestones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("마일스톤 조회 실패:", error);
        setAllMilestones([]);
      }
    };
    fetchMilestones();
  }, [babyId, babyAgeMonths]);

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

  return (
    <div className="milestone-container">
      <h4 className="milestone-title">
        발달 마일스톤 ({getAgeRangeLabel(babyAgeMonths)} 기준)
      </h4>

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
                  onChange={() => checkMilestone(babyId, m.m_id, !m.is_achieved)}
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