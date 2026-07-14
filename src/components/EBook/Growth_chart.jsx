// components/EBook/Growth_chart.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getRecord } from "../../services/record_api";
import { getBabyStandard } from "../../services/compare_api";
import RecordQuickAdd from "./RecordQuickAdd";
import "../../styles/Growth_chart.css";

const CHART_H = 170;
const PAD = { top: 30, right: 24, bottom: 28, left: 24 };
const MIN_CHART_W = 300;
const POINT_SPACING_BY_MODE = { "1m": 64, "6m": 35, all: 20 };
const Y_PADDING = 2;
const TOOLTIP_W = 90;
const TOOLTIP_W_DIFF = 122;
const TOOLTIP_H = 40;
const DRAG_THRESHOLD = 4; // 이 픽셀 이상 움직여야 "드래그"로 인정 (짧은 클릭과 구분)

function parseUtcDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return new Date(value);
  const hasOffset = /Z$|[+-]\d{2}:\d{2}$/.test(value);
  return new Date(hasOffset ? value : `${value}Z`);
}

function ageInMonths(birth, target) {
  const b = parseUtcDate(birth);
  const t = parseUtcDate(target);
  const days = (t - b) / (1000 * 60 * 60 * 24);
  return Math.max(0, +(days / 30.4375).toFixed(3));
}

function formatKoreanDate(value) {
  const d = parseUtcDate(value);
  return d.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric" });
}
function formatKoreanTime(value) {
  const d = parseUtcDate(value);
  return d.toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function genderToSex(gender) {
  return gender === "여" ? "F" : "M";
}

function interpolateAt(ageMonths, sortedPoints) {
  if (!sortedPoints || sortedPoints.length === 0) return null;
  if (ageMonths <= sortedPoints[0].month) return sortedPoints[0].value;
  if (ageMonths >= sortedPoints[sortedPoints.length - 1].month) {
    return sortedPoints[sortedPoints.length - 1].value;
  }
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const a = sortedPoints[i];
    const bnd = sortedPoints[i + 1];
    if (ageMonths >= a.month && ageMonths <= bnd.month) {
      const ratio = bnd.month === a.month ? 0 : (ageMonths - a.month) / (bnd.month - a.month);
      return +(a.value + (bnd.value - a.value) * ratio).toFixed(2);
    }
  }
  return null;
}

function filterByViewMode(points, viewMode) {
  if (points.length === 0) return points;
  if (viewMode === "all") return points;
  const span = viewMode === "1m" ? 1 : 6;
  const lastAge = points[points.length - 1].month;
  const cutoff = lastAge - span;
  return points.filter((p) => p.month >= cutoff);
}

// ---------------------------------------------------------------------------
// 차트 본체
// ---------------------------------------------------------------------------
function DualLineChart({ babyPoints, stdMatched, viewMode, onEditPoint }) {
  const scrollRef = useRef(null);
  const dragRef = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });
  const suppressClickRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(null);

  const visibleBaby = useMemo(() => filterByViewMode(babyPoints, viewMode), [babyPoints, viewMode]);
  const visibleStd = useMemo(() => filterByViewMode(stdMatched, viewMode), [stdMatched, viewMode]);

  const n = visibleBaby.length;
  const pointSpacing = POINT_SPACING_BY_MODE[viewMode] ?? 56;
  const chartW = Math.max(MIN_CHART_W, PAD.left + PAD.right + pointSpacing * Math.max(0, n - 1));
  const usableH = CHART_H - PAD.top - PAD.bottom;

  const { vMin, vMax } = useMemo(() => {
    const vals = [...visibleBaby.map((p) => p.value), ...visibleStd.map((p) => p.value).filter((v) => v != null)];
    if (vals.length === 0) return { vMin: 0, vMax: 1 };
    return { vMin: Math.min(...vals) - Y_PADDING, vMax: Math.max(...vals) + Y_PADDING };
  }, [visibleBaby, visibleStd]);

  const toX = useCallback((i) => PAD.left + i * pointSpacing, [pointSpacing]);
  const toY = useCallback(
    (value) => PAD.top + usableH - ((value - vMin) / (vMax - vMin || 1)) * usableH,
    [usableH, vMin, vMax]
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [chartW]);

  useEffect(() => {
    setActiveIdx(null);
  }, [viewMode]);

  // ---- 마우스 드래그로 좌우 스크롤 ----
  // 주의: pointerdown 시점에 곧바로 setPointerCapture를 걸면, 이후의 모든
  // 마우스/클릭 이벤트가 (점이 아니라) 이 컨테이너로 재라우팅되어서
  // 그냥 클릭한 것도 점의 onClick까지 도달하지 못하는 문제가 생긴다.
  // 그래서 "실제로 DRAG_THRESHOLD 이상 움직였을 때"만 캡처를 건다.
  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === "touch") return;
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      pointerId: e.pointerId,
      captured: false,
    };
  }, []);

  const handlePointerMove = useCallback((e) => {
    const el = scrollRef.current;
    const drag = dragRef.current;
    if (!drag.isDown || !el) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      drag.moved = true;
      if (!drag.captured) {
        el.setPointerCapture(drag.pointerId);
        el.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
        drag.captured = true;
      }
    }
    if (drag.moved) el.scrollLeft = drag.startScroll - dx;
  }, []);

  const handlePointerUp = useCallback((e) => {
    const el = scrollRef.current;
    const drag = dragRef.current;
    if (!el) return;
    if (drag.moved) suppressClickRef.current = true; // 드래그였으면 뒤이어 오는 클릭(점 선택)을 무시
    if (drag.captured) {
      el.style.cursor = "grab";
      document.body.style.userSelect = "";
      try { el.releasePointerCapture(drag.pointerId ?? e.pointerId); } catch (_) {}
    }
    dragRef.current.isDown = false;
  }, []);

  const handleSvgClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setActiveIdx(null);
  }, []);

  if (n === 0) {
    return <p className="growth-chart-empty">아직 기록이 없어요</p>;
  }

  const babyPath = visibleBaby.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.value)}`).join(" ");
  const stdPath = visibleStd
    .map((p, i) => (p.value != null ? `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.value)}` : ""))
    .join(" ");

  const firstLabel = formatKoreanDate(visibleBaby[0].date);
  const lastLabel = formatKoreanDate(visibleBaby[n - 1].date);
  const sameDayLabel = firstLabel === lastLabel;

  return (
    <>
      <div
        className="growth-chart-scroll"
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          viewBox={`0 0 ${chartW} ${CHART_H}`}
          width={chartW}
          height={CHART_H}
          className="growth-line-svg"
          onClick={handleSvgClick}
        >
          {visibleStd.some((p) => p.value != null) && (
            <path d={stdPath} fill="none" stroke="#C9C0B8" strokeWidth="2" strokeDasharray="4 4" />
          )}

          {visibleStd.map((p, i) =>
            p.value != null ? (
              <g key={`s-${i}`}>
                <circle cx={toX(i)} cy={toY(p.value)} r="3" fill="#C9C0B8" stroke="#fff" strokeWidth="1.5" />
                <text x={toX(i)} y={toY(p.value) + 15} textAnchor="middle" className="growth-std-label">
                  {p.value}
                </text>
              </g>
            ) : null
          )}

          <path d={babyPath} fill="none" stroke="#F07C60" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {visibleBaby.map((p, i) => (
            <g
              key={`b-${p.r_id ?? i}`}
              className="growth-point-hit"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx((cur) => (cur === i ? null : cur))}
              onClick={(e) => {
                e.stopPropagation();
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
                setActiveIdx(null);
                onEditPoint?.(p); // 클릭 = 이 기록을 수정 모드로 열기
              }}
            >
              <circle cx={toX(i)} cy={toY(p.value)} r="14" fill="transparent" />
              <circle cx={toX(i)} cy={toY(p.value)} r="4" fill="#F07C60" stroke="#fff" strokeWidth="1.5" />
              <text x={toX(i)} y={toY(p.value) - 10} textAnchor="middle" className="growth-point-label">
                {p.value}
              </text>
            </g>
          ))}

          {sameDayLabel ? (
            <text x={chartW / 2} y={CHART_H - 8} textAnchor="middle" className="growth-x-label">
              {firstLabel}
            </text>
          ) : (
            <>
              <text x={toX(0)} y={CHART_H - 8} textAnchor="start" className="growth-x-label">
                {firstLabel}
              </text>
              <text x={toX(n - 1)} y={CHART_H - 8} textAnchor="end" className="growth-x-label">
                {lastLabel}
              </text>
            </>
          )}

          {/* 호버(마우스)일 때만 정보 미리보기 — 클릭은 위에서 바로 수정 모드로 이동하므로
              여기서는 "보기 전용" 툴팁만 담당 */}
          {activeIdx != null && visibleBaby[activeIdx] && (
            <ChartTooltip
              x={toX(activeIdx)}
              y={toY(visibleBaby[activeIdx].value)}
              point={visibleBaby[activeIdx]}
              stdValue={visibleStd[activeIdx]?.value ?? null}
              chartW={chartW}
            />
          )}
        </svg>
      </div>
      <div className="growth-legend">
        <span className="legend-dot baby" />우리 아이
        <span className="legend-dot standard" />또래 평균
      </div>
      <p className="growth-edit-hint">점을 탭하면 그 기록을 수정하거나 삭제할 수 있어요</p>
    </>
  );
}

function ChartTooltip({ x, y, point, stdValue, chartW }) {
  const hasDiff = stdValue != null;
  const diff = hasDiff ? +(point.value - stdValue).toFixed(1) : null;
  const diffLabel = hasDiff ? `${diff > 0 ? "+" : ""}${diff}${point.unit}` : null;
  const diffClass =
    diff > 0 ? "growth-tooltip-diff-up" : diff < 0 ? "growth-tooltip-diff-down" : "growth-tooltip-diff-flat";

  const tooltipW = hasDiff ? TOOLTIP_W_DIFF : TOOLTIP_W;
  const tooltipH = hasDiff ? TOOLTIP_H + 16 : TOOLTIP_H;

  const preferredAboveTop = y - tooltipH - 14;
  const flipBelow = preferredAboveTop < 2;
  const by = flipBelow ? y + 14 : preferredAboveTop;

  let bx = x - tooltipW / 2;
  if (bx < 2) bx = 2;
  if (bx + tooltipW > chartW - 2) bx = chartW - 2 - tooltipW;

  return (
    <g className="growth-tooltip-group">
      <rect x={bx} y={by} width={tooltipW} height={tooltipH} rx="10" className="growth-tooltip-bg" />
      <text x={bx + tooltipW / 2} y={by + 17} textAnchor="middle" className="growth-tooltip-text">
        {point.value}
        {point.unit}
      </text>
      <text x={bx + tooltipW / 2} y={by + 31} textAnchor="middle" className="growth-tooltip-date">
        {formatKoreanDate(point.date)} {formatKoreanTime(point.date)}
      </text>
      {hasDiff && (
        <text x={bx + tooltipW / 2} y={by + 46} textAnchor="middle" className={diffClass}>
          또래 대비 {diffLabel}
        </text>
      )}
    </g>
  );
}

function GrowthSpeedCard({ babyPoints, label, unit }) {
  if (babyPoints.length < 2) {
    return (
      <div className="growth-speed-card">
        <p className="speed-title">{label} 성장 속도</p>
        <p className="speed-empty">기록이 2개 이상 쌓이면 지난 기록과 비교해드려요</p>
      </div>
    );
  }

  const prev = babyPoints[babyPoints.length - 2];
  const latest = babyPoints[babyPoints.length - 1];
  const babyDelta = latest.value - prev.value;

  const message = `지난 기록보다 ${babyDelta > 0 ? "+" : ""}${babyDelta.toFixed(1)}${unit} 변화했어요`;

  return (
    <div className="growth-speed-card">
      <p className="speed-title">{label} 성장 속도</p>
      <p className="speed-value">
        {formatKoreanDate(prev.date)} → {formatKoreanDate(latest.date)} : {babyDelta > 0 ? "+" : ""}
        {babyDelta.toFixed(1)}
        {unit}
      </p>
      <p className="speed-message">{message}</p>
    </div>
  );
}

function Growth_chart({ baby }) {
  const [records, setRecords] = useState([]);
  const [standards, setStandards] = useState([]);
  const [metric, setMetric] = useState("height");
  const [viewMode, setViewMode] = useState("1m");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 수정 중인 원본 record (r_id 포함) 또는 null

  const fetchRecords = useCallback(async () => {
    if (!baby?.b_id) return;
    try {
      const result = await getRecord(baby.b_id);
      setRecords(Array.isArray(result) ? result : []);
    } catch (error) {
      setRecords([]);
    }
  }, [baby?.b_id]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const buildBabyPoints = useCallback(
    (key, unit) =>
      baby
        ? records
            .map((r) => ({
              r_id: r.r_id,
              month: ageInMonths(baby.b_birth, r.r_date),
              value: Number(r[key]),
              date: r.r_date,
              unit,
            }))
            .sort((a, b) => a.month - b.month)
        : [],
    [baby, records]
  );

  const heightBabyPoints = useMemo(() => buildBabyPoints("r_height", "cm"), [buildBabyPoints]);
  const weightBabyPoints = useMemo(() => buildBabyPoints("r_weight", "kg"), [buildBabyPoints]);

  const maxRecordedAge = useMemo(() => {
    const all = [...heightBabyPoints, ...weightBabyPoints].map((p) => p.month);
    return all.length > 0 ? Math.max(...all) : 12;
  }, [heightBabyPoints, weightBabyPoints]);

  useEffect(() => {
    const fetchStandards = async () => {
      if (!baby || records.length === 0) {
        setStandards([]);
        return;
      }
      const sex = genderToSex(baby.b_gender);
      const maxMonth = Math.ceil(maxRecordedAge);
      const monthList = Array.from({ length: maxMonth + 1 }, (_, i) => i);

      const results = await Promise.all(
        monthList.map(async (m) => {
          try {
            const std = await getBabyStandard(sex, m);
            return { month: m, height: Number(std.height), weight: Number(std.weight) };
          } catch {
            return null;
          }
        })
      );
      setStandards(results.filter(Boolean).sort((a, b) => a.month - b.month));
    };
    fetchStandards();
  }, [baby, records.length, maxRecordedAge]);

  const buildStdMatched = useCallback(
    (key, babyPoints) => {
      if (standards.length === 0) return babyPoints.map(() => ({ value: null }));
      const raw = standards.map((s) => ({ month: s.month, value: s[key] }));
      return babyPoints.map((p) => ({ month: p.month, value: interpolateAt(p.month, raw) }));
    },
    [standards]
  );

  const heightStdMatched = useMemo(() => buildStdMatched("height", heightBabyPoints), [buildStdMatched, heightBabyPoints]);
  const weightStdMatched = useMemo(() => buildStdMatched("weight", weightBabyPoints), [buildStdMatched, weightBabyPoints]);

  const activePoints = metric === "height" ? heightBabyPoints : weightBabyPoints;
  const activeStdMatched = metric === "height" ? heightStdMatched : weightStdMatched;
  const unit = metric === "height" ? "cm" : "kg";

  // 차트의 점(r_id만 갖고 있음)을 클릭하면, 원본 records에서 height/weight를 모두 찾아
  // 수정 모달에 그대로 넘김 (어느 탭(키/몸무게)에서 클릭했든 두 값 다 보여주기 위함)
  const handleEditPoint = useCallback(
    (point) => {
      const full = records.find((r) => r.r_id === point.r_id);
      if (full) setEditingRecord(full);
    },
    [records]
  );

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRecord(null);
  };

  return (
    <div className="growth-chart-wrapper">
      <div className="growth-chart-header">
        <button type="button" className="record-add-btn" onClick={() => setShowAddModal(true)}>
          + 기록 추가
        </button>
      </div>

      <div className="metric-toggle">
        <button type="button" className={metric === "height" ? "active" : ""} onClick={() => setMetric("height")}>
          키 (cm)
        </button>
        <button type="button" className={metric === "weight" ? "active" : ""} onClick={() => setMetric("weight")}>
          몸무게 (kg)
        </button>
      </div>

      <div className="viewmode-toggle">
        {[
          { key: "1m", label: "최근 1개월" },
          { key: "6m", label: "최근 6개월" },
          { key: "all", label: "전체 추이" },
        ].map((v) => (
          <button
            key={v.key}
            type="button"
            className={viewMode === v.key ? "active" : ""}
            onClick={() => setViewMode(v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="growth-chart-box">
        <DualLineChart
          babyPoints={activePoints}
          stdMatched={activeStdMatched}
          viewMode={viewMode}
          onEditPoint={handleEditPoint}
        />
      </div>

      <GrowthSpeedCard babyPoints={activePoints} label={metric === "height" ? "키" : "몸무게"} unit={unit} />

      {(showAddModal || editingRecord) && (
        <RecordQuickAdd
          b_id={baby?.b_id}
          editRecord={editingRecord}
          onClose={closeModal}
          onSuccess={fetchRecords}
          onDeleted={fetchRecords}
        />
      )}
    </div>
  );
}

export default Growth_chart;