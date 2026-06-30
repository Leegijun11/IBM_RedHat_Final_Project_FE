import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryList, deleteDiary } from "../../services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";
import NaviBar from "../common/NaviBar";

// 요일 라벨 (월요일 시작)
const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

// selectedDate(YYYY-MM-DD)가 포함된 주의 월~일 7일을 계산해서 배열로 반환
// (신규 함수: 기존 데이터 조회/삭제 로직과는 무관, 캘린더 표시 전용)
function getWeekDates(dateStr) {
    const base = new Date(dateStr);
    const day = base.getDay(); // 0=일, 1=월, ... 6=토
    const mondayOffset = day === 0 ? -6 : 1 - day; // 일요일이면 -6, 그 외엔 1-day
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

// Date 객체를 YYYY-MM-DD 문자열로 변환 (selectedDate 형식과 동일하게)
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

    // 캘린더에서 날짜 클릭 시 selectedDate만 갱신 (기존 useEffect가 알아서 재조회함)
    const weekDates = getWeekDates(selectedDate);
    const selectedMonthLabel = `${new Date(selectedDate).getFullYear()}년 ${new Date(selectedDate).getMonth() + 1}월`;

    return (
        <div className="diary-page-wrap">
            <div className="diary-page-header">
                <h2>성장 일기 📝</h2>
            </div>

            {/* 연/월 표시 + 주간 이동 (이동 화살표는 selectedDate를 ±7일 이동) */}
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
                    // TODO: 더미 플래그. 추후 "주간 일기 존재 여부" API 연동 시
                    // 아래 hasDiary를 실제 응답값(boolean)으로 교체하면 됨.
                    const hasDiary = false;
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

            {/* 기존 날짜 입력창은 보조 수단으로 유지 (캘린더와 동일한 selectedDate를 공유) */}
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            {diaryList.length === 0 ? (
                <p className="diary-empty-text">등록된 일기가 없습니다.</p>
            ) : (
                diaryList.map((diary) => (
                    <div
                        key={diary.d_id}
                        className="diary-card"
                        onClick={() => navigate(`/diary/${diary.d_id}`)}
                    >
                        {diary.d_label && (
                            <span className="diary-label-chip">{diary.d_label}</span>
                        )}
                        <h3>{diary.d_title}</h3>
                        <p>{diary.d_content}</p>
                        <p>식사 : {diary.d_eat}</p>
                        <p>수면 : {diary.d_sleep}</p>
                        <p>화장실 : {diary.d_toilet}</p>
                        <p>{diary.d_date}</p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDiary(diary.d_id);
                            }}
                        >
                            삭제
                        </button>
                    </div>
                ))
            )}

            {/* + 버튼 */}
            <button
                className="diary-write-fab"
                onClick={() => navigate("/diary/write")}
            >
                +
            </button>

            <NaviBar/>
        </div>
    );
}

export default Diary_list;
