import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryList, deleteDiary } from "../../services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../common/NaviBar";
import SecureImage from "../common/SecureImage";

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
    const { showAlert, showConfirm } = useModal(); 

    const [diaryList, setDiaryList] = useState([]);
    const [bId, setBId] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        toDateStr(new Date())
    );

    const [isFabOpen, setIsFabOpen] = useState(false)

    // ★ 추가: 일기가 존재하는 날짜(YYYY-MM-DD) 모음
    const [diaryDates, setDiaryDates] = useState(new Set());

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

    // 추가: 한 주(월~일) 동안 일기가 있는 날짜만 모아서 Set으로 저장
    const fetchWeekDiaryDates = async (b_id, weekDates) => {
        try {
            const results = await Promise.allSettled(
                weekDates.map((d) => getDiaryList(b_id, toDateStr(d)))
            );

            const datesWithDiary = new Set();
            weekDates.forEach((d, idx) => {
                const result = results[idx];
                if (result.status === "fulfilled" && Array.isArray(result.value) && result.value.length > 0) {
                    datesWithDiary.add(toDateStr(d));
                }
            });
            setDiaryDates(datesWithDiary);
        } catch (error) {
            console.log(error);
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
                showAlert("등록된 아기 정보가 없습니다.", "error");
                navigate("/babyinfo");
            }
        };
        fetchBaby();
    }, []);

    // 날짜 또는 b_id 바뀔 때마다 목록 갱신
    useEffect(() => {
        if (bId) {
            handleCreateDiaryList(bId);
            fetchWeekDiaryDates(bId, getWeekDates(selectedDate));
        }
    }, [selectedDate, bId]);

    // 삭제
    const handleDeleteDiary = async (d_id) => {
        const check = showConfirm("정말 삭제하시겠습니까?");
        if (!check) return;

        try {
            await deleteDiary(d_id);
            showAlert("일기가 삭제되었습니다.");
            handleCreateDiaryList(bId);
            fetchWeekDiaryDates(bId, getWeekDates(selectedDate));
        } catch (error) {
            console.log(error);
            showAlert("일기 삭제에 실패하였습니다.", "error");
        }
    };

    const weekDates = getWeekDates(selectedDate);
    const selectedMonthLabel = `${new Date(selectedDate).getFullYear()}년 ${new Date(selectedDate).getMonth() + 1}월`;

    return (
        <div className="diary-page-wrap page-container">
            <div className="diary-page-header">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    성장 일기
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07C60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
                    </svg>
                </h2>
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            {/* 주간 요일 캘린더 (월~일) */}
            <div className="week-day-list">
                {weekDates.map((d, idx) => {
                    const dStr = toDateStr(d);
                    const isActive = dStr === selectedDate;
                    const hasDiary = diaryDates.has(dStr);
                    return (
                        <div
                            key={dStr}
                            className={`week-day-item${isActive ? " active" : ""}`}
                            onClick={() => setSelectedDate(dStr)}
                        >
                            <span className="week-day-label">{WEEK_LABELS[idx]}</span>
                            <span className="week-day-num">{d.getDate()}</span>
                            <span className={`week-day-dot-slot${hasDiary ? " has-diary" : ""}`} />
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
                        {/* 1. 상단 영역: 감정 라벨과 삭제 버튼 */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                            <div>
                                {diary.d_label && (
                                    <span className="diary-label-chip" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                        </svg>
                                        {diary.d_label}
                                    </span>
                                )}
                            </div>
                            
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDiary(diary.d_id);
                                }}
                                style={{ 
                                    margin: 0, 
                                    padding: "4px 8px", 
                                    background: "transparent", 
                                    border: "none", 
                                    color: "var(--text-hint, #999)", 
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* 텍스트 내용과 이미지 (4x2 비율 80x40px 고정) */}
                        <div style={{ display: "flex", gap: "14px", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3>{diary.d_title}</h3>
                                <p style={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {diary.d_content}
                                </p>
                            </div>
                            
                            {diary.d_image && (
                                <div style={{ width: "80px", height: "40px", flexShrink: 0, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                                    <SecureImage
                                        path={diary.d_image}
                                        alt="아기 스냅샷"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 🌟 2. 육아 범주 데이터 스탯 (미니 대시보드 스타일 유지 + 수저/똥 아이콘 적용) */}
                        {(diary.d_eat !== "없음" || diary.d_sleep !== "없음" || diary.d_toilet !== "없음" || diary.d_temp !== "없음") && (
                            <div style={{ 
                                display: "flex", 
                                flexWrap: "wrap", 
                                gap: "12px", 
                                margin: "14px 0 8px 0", 
                                padding: "12px", 
                                backgroundColor: "#FDF9F5", 
                                borderRadius: "12px", 
                                border: "1px solid #F3EDE8" 
                            }}>
                                
                                {diary.d_eat && diary.d_eat !== "없음" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "80px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#FFE8D6", display: "flex", alignItems: "center", justifyContent: "center", color: "#F07C60", flexShrink: 0 }}>
                                            {/* 🌟 식사: 숟가락과 젓가락(수저) 아이콘 */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M8 2c-1.7 0-3 1.8-3 4 0 2 1.3 3.5 2.5 3.9V22"/>
                                                <path d="M8 2c1.7 0 3 1.8 3 4 0 2-1.3 3.5-2.5 3.9"/>
                                                <line x1="15" y1="2" x2="15" y2="22"/>
                                                <line x1="19" y1="2" x2="19" y2="22"/>
                                            </svg>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "11px", color: "#A3968C", fontWeight: "600", lineHeight: "1.2" }}>식사</span>
                                            <span style={{ fontSize: "13px", fontWeight: "800", color: "#333333", lineHeight: "1.2" }}>{diary.d_eat}</span>
                                        </div>
                                    </div>
                                )}

                                {diary.d_sleep && diary.d_sleep !== "없음" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "80px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#EBEFF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B8EAD", flexShrink: 0 }}>
                                            {/* 수면: 달 아이콘 유지 */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                            </svg>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "11px", color: "#A3968C", fontWeight: "600", lineHeight: "1.2" }}>수면</span>
                                            <span style={{ fontSize: "13px", fontWeight: "800", color: "#333333", lineHeight: "1.2" }}>{diary.d_sleep}</span>
                                        </div>
                                    </div>
                                )}

                                {diary.d_toilet && diary.d_toilet !== "없음" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "80px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#E6F2EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#5EA37B", flexShrink: 0 }}>
                                            {/* 🌟 배변: 둥글고 귀여운 똥 모양 아이콘 */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2C8 2 8 7 8 7c-2 0-3 1.5-3 3 0 1.3 1 2.5 2 3-1.5.5-3 2-3 4 0 2.5 3 4 8 4s8-1.5 8-4c0-2-1.5-3.5-3-4 1-.5 2-1.7 2-3 0-1.5-1-3-3-3 0 0 0-5-4-5z"/>
                                            </svg>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "11px", color: "#A3968C", fontWeight: "600", lineHeight: "1.2" }}>배변</span>
                                            <span style={{ fontSize: "13px", fontWeight: "800", color: "#333333", lineHeight: "1.2" }}>{diary.d_toilet}</span>
                                        </div>
                                    </div>
                                )}

                                {diary.d_temp && diary.d_temp !== "없음" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "80px" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#FCEAE8", display: "flex", alignItems: "center", justifyContent: "center", color: "#D96A6A", flexShrink: 0 }}>
                                            {/* 체온: 온도계 아이콘 유지 */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                                                <path d="M12 12v3"/>
                                            </svg>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "11px", color: "#A3968C", fontWeight: "600", lineHeight: "1.2" }}>체온</span>
                                            <span style={{ fontSize: "13px", fontWeight: "800", color: "#333333", lineHeight: "1.2" }}>{diary.d_temp}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. 하단 정보 영역: 작성일 */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-hint)", fontWeight: "600" }}>
                                {diary.d_date ? diary.d_date.split("T")[0] : ""}
                            </span>
                        </div>
                    </div>
                ))
            )}
            <div className="diary-fab-container">
                {isFabOpen && (
                    <div className="diary-fab-menu">
                        <button className="fab-menu-ai" onClick={() => navigate("/diary/write")}>
                            AI 일기 쓰기
                        </button>
                        <button className="fab-menu-direct" onClick={() => navigate("/diary/write/direct")}>
                            직접 쓰기
                        </button>
                    </div>
                )}
                
                <button 
                    className="diary-write-fab" 
                    onClick={() => setIsFabOpen(!isFabOpen)}
                >
                    {isFabOpen ? "×" : "+"}
                </button>
            </div>

            <NaviBar />
        </div>
    );
}

export default Diary_list;