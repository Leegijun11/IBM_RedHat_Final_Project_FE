import React, { useState, useEffect } from "react";
import { getMilestones } from "../../services/milestone_api";
import "../../styles/MilestoneList.css";

function MilestoneList({ babyId, babyAgeMonths }) {
  const [allMilestones, setAllMilestones] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const categories = ["전체", "신체·발달", "사회·정서", "감각·모방", "언어·소통", "구강·위생", "인지·학습"];

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
        const data = await getMilestones(babyId, null, "", currentBucket);
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
      const filtered = allMilestones.filter((m) => m.m_category === selectedCategory);
      setMilestones(filtered);
    }
  }, [selectedCategory, allMilestones]);

  const groupedMilestones =
    selectedCategory === "전체"
      ? { "전체": milestones }
      : milestones.reduce((groups, m) => {
          const cat = m.m_category || "기타";
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(m);
          return groups;
        }, {});

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const totalCount = allMilestones.length;
  const totalAchieved = allMilestones.filter((m) => m.is_achieved).length;
  const totalPercent = totalCount > 0 ? Math.round((totalAchieved / totalCount) * 100) : 0;

  return (
    <div className="milestone-container">
      {/* 1. 상단 타이틀 (고정) */}
      <h2 className="milestone-page-title">발달 마일스톤</h2>

      {/* 2. 좌우 화살표 + 드롭다운 선택 영역을 한 줄로 병합 */}
      <div className="milestone-age-nav">
        <button className="nav-arrow-btn" onClick={handlePrevBucket} disabled={currentBucket === 2}>‹</button>

        <div className="milestone-select-wrapper">
          <select
            className="milestone-age-select"
            value={currentBucket}
            onChange={(e) => setCurrentBucket(Number(e.target.value))}
          >
            {ageBuckets.map((bucket) => (
              <option key={bucket} value={bucket}>
                {getAgeRangeLabel(bucket - 1)}
              </option>
            ))}
          </select>
        </div>

        <button className="nav-arrow-btn" onClick={handleNextBucket} disabled={currentBucket === 60}>›</button>
      </div>

      {/* 이하 기존 코드 동일 */}
      {totalCount > 0 && (
        <div className="milestone-summary-banner">
          <div className="summary-banner-ring">
            <svg viewBox="0 0 64 64" className="summary-ring-svg">
              <circle cx="32" cy="32" r="27" className="summary-ring-bg" />
              <circle
                cx="32" cy="32" r="27"
                className="summary-ring-fill"
                style={{
                  strokeDasharray: `${2 * Math.PI * 27}`,
                  strokeDashoffset: `${2 * Math.PI * 27 * (1 - totalPercent / 100)}`,
                }}
              />
            </svg>
            <span className="summary-ring-text">{totalPercent}%</span>
          </div>
          <div className="summary-banner-info">
            <span className="summary-banner-label">이번 구간 발달 현황</span>
            <span className="summary-banner-value">{totalAchieved}개 / 전체 {totalCount}개 달성</span>
          </div>
        </div>
      )}

      <div className="milestone-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-tab-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {milestones.length === 0 ? (
        <p className="milestone-empty">해당 항목이 없습니다.</p>
      ) : (
        <div className="milestone-groups">
          {Object.entries(groupedMilestones).map(([cat, items]) => {
            const achievedCount = items.filter((m) => m.is_achieved).length;
            const isCollapsed = collapsedCategories[cat];
            const percent = items.length > 0 ? Math.round((achievedCount / items.length) * 100) : 0;

            return (
              <div className="milestone-group" key={cat}>
                <button
                  type="button"
                  className="milestone-group-header"
                  onClick={() => toggleCategoryCollapse(cat)}
                >
                  <div className="milestone-group-header-left">
                    <span className={`milestone-group-dot dot-${cat}`} />
                    <span className="milestone-group-title">{cat}</span>
                    <span className="milestone-group-count">{achievedCount}/{items.length} 달성</span>
                  </div>
                  <div className="milestone-group-header-right">
                    <span className={`milestone-group-chevron ${isCollapsed ? "collapsed" : ""}`}>⌃</span>
                  </div>
                </button>

                {!isCollapsed && (
                  <ul className="milestone-list">
                    {items.map((m) => (
                      <li key={m.m_id} className={`milestone-item ${m.is_achieved ? "achieved" : ""}`}>
                        <div className="checkbox-wrapper">
                          <span className={`custom-check ${m.is_achieved ? "checked" : ""}`}>
                            {m.is_achieved && "✔"}
                          </span>
                          <span className="checkbox-text">{m.app_milestone}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MilestoneList;