import React, { useState, useEffect } from "react";
import { getMilestones, checkMilestone } from "../../services/milestone_api";
import "../../styles/MilestoneList.css";

function MilestoneList({ babyId, babyAgeMonths }) {
  const [milestones, setMilestones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "인지", "언어/의사소통", "신체 발달", "사회성/정서"];

  // 구간을 표시하기 위한 라벨 계산
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

  // 서버에 전달할 타겟 나이 (기존 로직 유지 또는 필요에 따라 조정)
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
        const data = await getMilestones(targetAge, selectedCategory === "전체" ? "" : selectedCategory, babyId);
        setMilestones(data);
      } catch (error) {
        console.error("마일스톤 조회 실패:", error);
      }
    };
    fetchMilestones();
  }, [babyAgeMonths, selectedCategory]);

return (
  <div className="milestone-card">

    <h4>발달 마일스톤 ({getAgeRangeLabel(babyAgeMonths)} 기준)</h4>

    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>

    <ul>
      {milestones.map((m) => (
<li key={m.m_id}>
    <label className="milestone-item">
        <input
            type="checkbox"
            checked={m.is_achieved}
            onChange={async () => {
                await checkMilestone(
                    babyId,
                    m.m_id,
                    !m.is_achieved
                );

                setMilestones((prev) =>
                    prev.map((item) =>
                        item.m_id === m.m_id
                            ? {
                                  ...item,
                                  is_achieved: !item.is_achieved,
                              }
                            : item
                    )
                );
            }}
        />

        <span>{m.app_milestone}</span>
    </label>
</li>
      ))}
    </ul>

  </div>
);
}

export default MilestoneList;