import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryList, deleteDiary } from "../../services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";
import NaviBar from "../common/NaviBar";

// ★ 백엔드 주소 설정 (환경변수 로드, 로컬 테스트용 기본값 지정)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// 요일 라벨 (월요일 시작)
const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

// selectedDate(YYYY-MM-DD)가 포함된 주의 월~일 7일을 계산해서 배열로 반환
function getWeekDates(dateStr) {
    const base = new Date(dateStr);
    const day = base.getDay(); // 0=일, 1=월, ... 6=토
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(base);
    monday.setDate(base.getDate() + mondayOffset);

    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        week.push(d);
    }
    return week;
}

// Date 객체를 YYYY-MM-DD 문자열로 변환
function toDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function Diary_list() {
    const navigate = useNavigate();

    const [diaryList, setDiaryList] = useState([]);
    const [bId, setBId] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // 일기 목록 조회
    const handleCreateDiaryList = async (b_id) => {
        try {
            const result = await getDiaryList(b_id, selectedDate);
            console.log(result);

            if (Array.isArray(result)) {
                setDiaryList(result);
            } else {
                setDiaryList([]);
            }
        } catch (error) {
            console.log(error);
            setDiaryList([]);
        }
    };

    // 아기 정보 가져오기
    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                setBId(baby.b_id);
            } catch (error) {
                console.log(error);
                alert("등록된 아기 정보가 없습니다.");
                navigate("/babyinfo");
            }
        };
        fetchBaby();
    }, []);

    // 날짜 또는 b_id 바뀔 때마다 목록 갱신
    useEffect(() => {
        if (bId) {
            handleCreateDiaryList(bId);
        }
    }, [selectedDate, bId]);

    // 삭제
    const handleDeleteDiary = async (d_id) => {
        const check = window.confirm("정말 삭제하시겠습니까?");
        if (!check) return;

        try {
            await deleteDiary(d_id);
            alert("일기가 삭제되었습니다.");
            handleCreateDiaryList(bId);
        } catch (error) {
            console.log(error);
            alert("일기 삭제에 실패하였습니다.");
        }
    };

    const weekDates = getWeekDates(selectedDate);
    const selectedMonthLabel = `${new Date(selectedDate).getFullYear()}년 ${new Date(selectedDate).getMonth() + 1}월`;

    return (
        <div className="diary-page-wrap">
            <div className="diary-page-header">
                <h2>성장 일기 📝</h2>
            </div>

            {/* 연/월 표시 + 주간 이동 */}
            <div className="week-calendar-month-row">
                <button
                    type="button"
                    className="week-calendar-arrow"
                    onClick={() => {
                        const prev = new Date(selectedDate);
                        prev.setDate(prev.getDate() - 7);
                        setSelectedDate(toDateStr(prev));
                    }}
                >
                    ‹
                </button>
                <span className="week-calendar-month">{selectedMonthLabel}</span>
                <button
                    type="button"
                    className="week-calendar-arrow"
                    onClick={() => {
                        const next = new Date(selectedDate);
                        next.setDate(next.getDate() + 7);
                        setSelectedDate(toDateStr(next));
                    }}
                >
                    ›
                </button>
            </div>

            {/* 주간 요일 캘린더 (월~일) */}
            <div className="week-day-list">
                {weekDates.map((d, idx) => {
                    const dStr = toDateStr(d);
                    const isActive = dStr === selectedDate;
                    const hasDiary = false; // 추후 기능 확장용 보존
                    return (
                        <div
                            key={dStr}
                            className={`week-day-item${isActive ? " active" : ""}`}
                            onClick={() => setSelectedDate(dStr)}
                        >
                            <span className="week-day-label">{WEEK_LABELS[idx]}</span>
                            <span className="week-day-num">{d.getDate()}</span>
                            {hasDiary && <span className="week-day-dot" />}
                        </div>
                    );
                })}
            </div>

            {/* 보조 날짜 입력창 */}
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            {/* 일기 리스트 영역 */}
            {diaryList.length === 0 ? (
                <p className="diary-empty-text">등록된 일기가 없습니다.</p>
            ) : (
                diaryList.map((diary) => (
                    <div
                        key={diary.d_id}
                        className="diary-card"
                        onClick={() => navigate(`/diary/${diary.d_id}`)}
                    >
                        {/* 1. 상단 감정 라벨 배치 */}
                        {diary.d_label && (
                            <div style={{ marginBottom: "6px" }}>
                                <span className="diary-label-chip">✨ {diary.d_label}</span>
                            </div>
                        )}

                        {/* 텍스트 내용과 이미지를 가로(Flex)로 배치하여 레이아웃을 최적화 */}
                        <div style={{ display: "flex", gap: "14px", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3>{diary.d_title}</h3>
                                <p style={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {diary.d_content}
                                </p>
                            </div>
                            
                            {/* ★ 변경 포인트: BACKEND_URL 주소를 결합하여 이미지 절대 주소 완성 */}
                            {diary.d_image && (
                                <div style={{ width: "64px", height: "64px", flexShrink: 0, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                                    <img 
                                        src={`${BACKEND_URL}/${diary.d_image}`} 
                                        alt="아기 스냅샷" 
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* 2. 하단 육아 범주 데이터 스탯 칩 (조건부 렌더링) */}
                        <div style={{ display: "flex", flexWrap: "wrap", margin: "8px 0" }}>
                            {diary.d_eat && diary.d_eat !== "없음" && (
                                <span className="chip-eat" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px", margin: "4px 6px 4px 0", backgroundColor: "#FFF3CD", color: "#856404" }}>
                                    🍼 식사 {diary.d_eat}
                                </span>
                            )}
                            {diary.d_sleep && diary.d_sleep !== "없음" && (
                                <span className="chip-sleep">💤 수면 {diary.d_sleep}</span>
                            )}
                            {diary.d_toilet && diary.d_toilet !== "없음" && (
                                <span className="chip-toilet">💩 배변 {diary.d_toilet}</span>
                            )}
                            {diary.d_temp && diary.d_temp !== "없음" && (
                                <span className="chip-temp">🌡️ 체온 {diary.d_temp}</span>
                            )}
                        </div>

                        {/* 3. 하단 정보 영역 (작성일 및 삭제 버튼 정돈) */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-hint)", fontWeight: "600" }}>
                                {diary.d_date ? diary.d_date.split("T")[0] : ""}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // 카드 상세 이동 클릭 이벤트 전파 차단
                                    handleDeleteDiary(diary.d_id);
                                }}
                                style={{ margin: 0 }} 
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* 플로팅 글쓰기 버튼 */}
            <button
                className="diary-write-fab"
                onClick={() => navigate("/diary/write")}
            >
                +
            </button>

            <NaviBar />
        </div>
    );
}

export default Diary_list;