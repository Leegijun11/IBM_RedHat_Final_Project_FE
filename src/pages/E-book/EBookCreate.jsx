import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentBaby } from "../../services/partner_api";
import { getAchievedMilestoneDiaries } from "../../services/ebook_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookCreate.css";

const REQUIRED_MILESTONE_COUNT = 4;

function EBookCreate() {
    const navigate = useNavigate();
    const [bId, setBId] = useState(null);
    const [period, setPeriod] = useState({ start: "", end: "" });
    const [achievedDiaries, setAchievedDiaries] = useState([]);
    const [selectedAchievedIds, setSelectedAchievedIds] = useState([]);
    const [loadingAchieved, setLoadingAchieved] = useState(false);
    const { showAlert } = useModal();

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                if (!baby) {
                    showAlert("등록된 아기 정보가 없습니다.", "error");
                    navigate("/babyinfo");
                    return;
                }
                setBId(baby.b_id);
            } catch (error) {
                console.error(error);
                showAlert("로그인이 필요합니다.", "error");
                navigate("/");
            }
        };
        fetchBaby();
    }, [navigate]);

    const isValidPeriod =
        period.start && period.end && new Date(period.start) <= new Date(period.end);

    useEffect(() => {
        if (!bId || !isValidPeriod) {
            return;
        }

        let cancelled = false;

        const fetchAchievedDiaries = async () => {
            setLoadingAchieved(true);
            setSelectedAchievedIds([]);
            try {
                const result = await getAchievedMilestoneDiaries(bId, period.start, period.end);
                if (!cancelled) {
                    setAchievedDiaries(Array.isArray(result) ? result : []);
                }
            } catch (error) {
                console.error(error);
                if (!cancelled) {
                    setAchievedDiaries([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingAchieved(false);
                }
            }
        };

        fetchAchievedDiaries();

        return () => {
            cancelled = true;
        };
    }, [bId, isValidPeriod, period.start, period.end]);

    const remainingCount = REQUIRED_MILESTONE_COUNT - selectedAchievedIds.length;

    const toggleAchievedSelect = (d_id) => {
        setSelectedAchievedIds((prev) => {
            if (prev.includes(d_id)) {
                return prev.filter((id) => id !== d_id);
            }
            if (prev.length >= REQUIRED_MILESTONE_COUNT) {
                showAlert(`마일스톤 일기는 최대 ${REQUIRED_MILESTONE_COUNT}개까지 선택할 수 있습니다.`, "error");
                return prev;
            }
            return [...prev, d_id];
        });
    };

    const handleNext = () => {
        if (!period.start || !period.end) {
            showAlert("기간을 선택해주세요.", "error");
            return;
        }
        if (new Date(period.start) > new Date(period.end)) {
            showAlert("시작 날짜가 종료 날짜보다 늦을 수 없습니다.", "error");
            return;
        }
        if (loadingAchieved) {
            showAlert("마일스톤 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.", "error");
            return;
        }

        navigate("/ebook/select", {
            state: {
                b_id: bId,
                start_date: period.start,
                end_date: period.end,
                milestone_diary_ids: selectedAchievedIds,
                required_additional_count: remainingCount,
            }
        });
    };

    return (
        <div className="ebook-create-page page-container">
            <div className="create-header">
                <h2>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F07C60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-8px", marginRight: "8px" }}>
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    디지털 북 만들기
                </h2>
                <p>원하는 기간을 선택하여 성장 디지털 북을 생성하세요.</p>
            </div>

            <div className="create-card">
                <h3>기간 선택하기</h3>

                <label className="create-label">시작 날짜</label>
                <input
                    className="date-input"
                    type="date"
                    value={period.start}
                    onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                />

                <label className="create-label">종료 날짜</label>
                <input
                    className="date-input"
                    type="date"
                    value={period.end}
                    onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                />

                {isValidPeriod && (
                    <>
                        <hr className="create-divider" />

                        <h4 className="diary-select-title">
                            마일스톤 일기 선택 (최대 {REQUIRED_MILESTONE_COUNT}개)
                        </h4>

                        {loadingAchieved ? (
                            <p className="empty-diary-msg">불러오는 중...</p>
                        ) : achievedDiaries.length === 0 ? (
                            <p className="empty-diary-msg">
                                이 기간에 달성한 마일스톤이 없습니다. 다음 단계에서 일기를 선택해주세요.
                            </p>
                        ) : (
                            <ul className="ebook-diary-list">
                                {achievedDiaries.map((diary) => (
                                    <li
                                        key={diary.d_id}
                                        className={`ebook-diary-item ${
                                            selectedAchievedIds.includes(diary.d_id) ? "selected" : ""
                                        }`}
                                        onClick={() => toggleAchievedSelect(diary.d_id)}
                                    >
                                        <div className="ebook-diary-info">
                                            <p className="ebook-diary-title">
                                                {diary.d_title}
                                            </p>
                                            <p className="ebook-diary-date">
                                                {diary.d_date?.substring(0, 10)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <p className="ebook-selected-count">
                            {remainingCount > 0
                                ? `선택한 마일스톤 일기: ${selectedAchievedIds.length}개 (다음 단계에서 ${remainingCount}개 더 선택하면 총 ${REQUIRED_MILESTONE_COUNT}개가 돼요)`
                                : `선택한 마일스톤 일기: ${selectedAchievedIds.length} / ${REQUIRED_MILESTONE_COUNT}개`}
                        </p>
                    </>
                )}

                <button className="create-submit" onClick={handleNext}>
                    다음 단계 →
                </button>
            </div>

            <NaviBar />
        </div>
    );
}

export default EBookCreate;