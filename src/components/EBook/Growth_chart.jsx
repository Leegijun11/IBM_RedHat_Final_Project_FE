import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getRecord } from "../../services/record_api";
import { getBabyStandard } from "../../services/compare_api"; // ✅ 기존 단일 조회 API 재사용
import RecordQuickAdd from "./RecordQuickAdd";
import "../../styles/Growth_chart.css";

const POINT_SPACING = 56;
const MIN_CHART_W = 300;
const CHART_H = 170;
const PAD = { top: 24, right: 24, bottom: 28, left: 24 };

function monthsBetween(birth, target) {
  const b = new Date(birth);
  const t = new Date(target);
  let months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
  if (t.getDate() < b.getDate()) months -= 1;
  return Math.max(0, months);
}

function genderToSex(gender) {
  return gender === "여" ? "F" : "M";
}

function buildDualSeries(babyPoints, standardPoints) {
  const allMonths = [
    ...new Set([...babyPoints.map((p) => p.month), ...standardPoints.map((p) => p.month)]),
  ].sort((a, b) => a - b);

  const values = [...babyPoints.map((p) => p.value), ...standardPoints.map((p) => p.value)];
  if (values.length === 0 || allMonths.length === 0) {
    return { babyXY: [], stdXY: [], months: [], chartW: MIN_CHART_W };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || max * 0.1 || 1;
  const domainMin = min - range * 0.2;
  const domainMax = max + range * 0.2;

  const chartW = Math.max(MIN_CHART_W, PAD.left + PAD.right + POINT_SPACING * (allMonths.length - 1));
  const usableW = chartW - PAD.left - PAD.right;
  const usableH = CHART_H - PAD.top - PAD.bottom;
  const step = allMonths.length > 1 ? usableW / (allMonths.length - 1) : 0;

  const monthIndex = new Map(allMonths.map((m, i) => [m, i]));
  const toXY = (m, v) => {
    const x = PAD.left + step * monthIndex.get(m);
    const ratio = (v - domainMin) / (domainMax - domainMin);
    const y = PAD.top + usableH - ratio * usableH;
    return { x, y };
  };

  const babyXY = babyPoints.map((p) => ({ ...toXY(p.month, p.value), value: p.value, month: p.month }));
  const stdXY = standardPoints.map((p) => ({ ...toXY(p.month, p.value), value: p.value, month: p.month }));

  return { babyXY, stdXY, months: allMonths, chartW };
}

function DualLineChart({ babyPoints, standardPoints }) {
  const scrollRef = useRef(null);
  const { babyXY, stdXY, months, chartW } = useMemo(
    () => buildDualSeries(babyPoints, standardPoints),
    [babyPoints, standardPoints]
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [chartW]);

  if (babyXY.length === 0) {
    return <p className="growth-chart-empty">아직 기록이 없어요</p>;
  }

  const babyPath = babyXY.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const stdPath = stdXY.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <>
      <div className="growth-chart-scroll" ref={scrollRef}>
        <svg viewBox={`0 0 ${chartW} ${CHART_H}`} width={chartW} height={CHART_H} className="growth-line-svg">
          {stdXY.length > 1 && (
            <path d={stdPath} fill="none" stroke="#C9C0B8" strokeWidth="2" strokeDasharray="4 4" />
          )}
          <path d={babyPath} fill="none" stroke="#F07C60" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {babyXY.map((p, i) => (
            <g key={`b-${i}`}>
              <circle cx={p.x} cy={p.y} r="4" fill="#F07C60" stroke="#fff" strokeWidth="1.5" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" className="growth-point-label">{p.value}</text>
            </g>
          ))}
          {months.map((m, i) => {
            const x = PAD.left + (chartW - PAD.left - PAD.right) * (months.length > 1 ? i / (months.length - 1) : 0);
            return (
              <text key={`m-${m}`} x={x} y={CHART_H - 8} textAnchor="middle" className="growth-x-label">
                {m}개월
              </text>
            );
          })}
        </svg>
      </div>
      <div className="growth-legend">
        <span className="legend-dot baby" />우리 아이
        <span className="legend-dot standard" />또래 평균
      </div>
    </>
  );
}

function GrowthSpeedCard({ babyPoints, standardPoints, label, unit }) {
  if (babyPoints.length < 2) {
    return (
      <div className="growth-speed-card">
        <p className="speed-title">{label} 성장 속도</p>
        <p className="speed-empty">기록이 2개 이상 쌓이면 또래와의 성장 속도를 비교해드려요</p>
      </div>
    );
  }

  const prev = babyPoints[babyPoints.length - 2];
  const latest = babyPoints[babyPoints.length - 1];
  const babyDelta = latest.value - prev.value;

  const findStdValue = (month) => standardPoints.find((s) => s.month === month)?.value ?? null;
  const stdPrev = findStdValue(prev.month);
  const stdLatest = findStdValue(latest.month);
  const stdDelta = stdPrev != null && stdLatest != null ? stdLatest - stdPrev : null;

  let message;
  if (stdDelta == null || stdDelta === 0) {
    message = `지난 기록보다 ${babyDelta > 0 ? "+" : ""}${babyDelta.toFixed(1)}${unit} 변화했어요`;
  } else {
    const ratio = Math.round((babyDelta / stdDelta) * 100);
    if (ratio > 115) message = `또래 평균보다 빠르게 자라고 있어요 (평균 대비 ${ratio}%)`;
    else if (ratio < 85) message = `또래 평균보다 조금 느리게 자라고 있어요 (평균 대비 ${ratio}%)`;
    else message = `또래 평균과 비슷한 속도로 자라고 있어요 (평균 대비 ${ratio}%)`;
  }

  return (
    <div className="growth-speed-card">
      <p className="speed-title">{label} 성장 속도</p>
      <p className="speed-value">
        {prev.month}개월→{latest.month}개월 : {babyDelta > 0 ? "+" : ""}{babyDelta.toFixed(1)}{unit}
      </p>
      <p className="speed-message">{message}</p>
    </div>
  );
}

function Growth_chart({ baby }) {  // ✅ b_id 대신 baby 객체 전체를 props로 받음
  const [records, setRecords] = useState([]);
  const [standards, setStandards] = useState([]); // [{ month, height, weight }]
  const [metric, setMetric] = useState("height");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!baby?.b_id) return;
    try {
      const result = await getRecord(baby.b_id);
      setRecords(Array.isArray(result) ? result : []);
    } catch (error) {
      setRecords([]);
    }
  }, [baby?.b_id]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // 기록에 있는 개월수마다 기존 단일 조회 API를 재사용해 표준값을 가져옴 (새 엔드포인트 없음)
  useEffect(() => {
    const fetchStandards = async () => {
      if (!baby || records.length === 0) {
        setStandards([]);
        return;
      }
      const sex = genderToSex(baby.b_gender);
      const months = [...new Set(records.map((r) => monthsBetween(baby.b_birth, r.r_date)))];

      const results = await Promise.all(
        months.map(async (m) => {
          try {
            const std = await getBabyStandard(sex, m);
            return { month: m, height: Number(std.height), weight: Number(std.weight) };
          } catch {
            return null; // 해당 개월 표준 데이터가 없으면 스킵
          }
        })
      );

      setStandards(results.filter(Boolean).sort((a, b) => a.month - b.month));
    };
    fetchStandards();
  }, [baby, records]);

  const heightBabyPoints = useMemo(
    () => (baby ? records.map((r) => ({ month: monthsBetween(baby.b_birth, r.r_date), value: Number(r.r_height) })) : []),
    [baby, records]
  );
  const weightBabyPoints = useMemo(
    () => (baby ? records.map((r) => ({ month: monthsBetween(baby.b_birth, r.r_date), value: Number(r.r_weight) })) : []),
    [baby, records]
  );
  const heightStdPoints = useMemo(() => standards.map((s) => ({ month: s.month, value: s.height })), [standards]);
  const weightStdPoints = useMemo(() => standards.map((s) => ({ month: s.month, value: s.weight })), [standards]);

  return (
    <div className="growth-chart-wrapper">
      <div className="growth-chart-header">
        <button type="button" className="record-add-btn" onClick={() => setShowAddModal(true)}>
          + 기록 추가
        </button>
      </div>

      <div className="metric-toggle">
        <button type="button" className={metric === "height" ? "active" : ""} onClick={() => setMetric("height")}>키 (cm)</button>
        <button type="button" className={metric === "weight" ? "active" : ""} onClick={() => setMetric("weight")}>몸무게 (kg)</button>
      </div>

      <div className="growth-chart-box">
        {metric === "height" ? (
          <DualLineChart babyPoints={heightBabyPoints} standardPoints={heightStdPoints} />
        ) : (
          <DualLineChart babyPoints={weightBabyPoints} standardPoints={weightStdPoints} />
        )}
      </div>

      {metric === "height" ? (
        <GrowthSpeedCard babyPoints={heightBabyPoints} standardPoints={heightStdPoints} label="키" unit="cm" />
      ) : (
        <GrowthSpeedCard babyPoints={weightBabyPoints} standardPoints={weightStdPoints} label="몸무게" unit="kg" />
      )}

      {showAddModal && (
        <RecordQuickAdd b_id={baby?.b_id} onClose={() => setShowAddModal(false)} onSuccess={fetchRecords} />
      )}
    </div>
  );
}

export default Growth_chart;