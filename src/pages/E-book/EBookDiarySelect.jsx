import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createEBook, getSelectableDiaries } from "../../services/ebook_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar";
import SecureImage from "../../components/common/SecureImage";
import "../../styles/EBookCreate.css";
import "../../styles/Diary.css";
import api from "../../hooks/api";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const COVER_OPTIONS = [
    {
        id: 1,
        name: "오리 연못",
        front: "cover/fcover1.png",
        back: "cover/bcover1.png"
    },
    {
        id: 2,
        name: "꽃길",
        front: "cover/fcover2.png",
        back: "cover/bcover2.png"
    },
    {
        id: 3,
        name: "숲속 요정",
        front: "cover/fcover3.png",
        back: "cover/bcover3.png"
    },
        {
        id: 4,
        name: "개구리 정원",
        front: "cover/fcover4.png",
        back: "cover/bcover4.png"
    },
        {
        id: 5,
        name: "열기구",
        front: "cover/fcover5.png",
        back: "cover/bcover5.png"
    },
        {
        id: 6,
        name: "작은 오두막",
        front: "cover/fcover6.png",
        back: "cover/bcover6.png"
    },
        {
        id: 7,
        name: "무지개 꿈",
        front: "cover/fcover7.png",
        back: "cover/bcover7.png"
    },
        {
        id: 8,
        name: "별고래",
        front: "cover/fcover8.png",
        back: "cover/bcover8.png"
    },
];

function EBookDiarySelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { showAlert } = useModal(); 

    const {
        b_id,
        start_date,
        end_date,
        milestone_diary_ids = [],
        required_additional_count
    } = state || {};

    const [diaries, setDiaries] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailDiary, setDetailDiary] = useState(null);

    const [selectedCoverId, setSelectedCoverId] = useState(null);

    const [tipIndex, setTipIndex] = useState(0);
    const tipTimerRef = useRef(null);

    const EBOOK_LOADING_MESSAGES = [
        "아이의 이야기가\n한 장 한 장 엮이고 있어요",
        "사진 속 순간이\n동화 속 장면으로 바뀌는 중이에요",
        "흩어진 하루하루가\n하나의 이야기가 되는 중이에요",
        "완성까지 조금만 기다려주세요,\n곧 첫 페이지가 열려요",
    ];

    const startTipRotation = () => {
        setTipIndex(0);
        let i = 0;
        tipTimerRef.current = setInterval(() => {
            i = (i + 1) % EBOOK_LOADING_MESSAGES.length;
            setTipIndex(i);
        }, 3500);
    };

    const stopTipRotation = () => {
        if (tipTimerRef.current) {
            clearInterval(tipTimerRef.current);
            tipTimerRef.current = null;
        }
    };

    useEffect(() => {
        if (!b_id) {
            navigate("/ebook/create");
            return;
        }

        const fetchDiaries = async () => {
            try {
                const result = await getSelectableDiaries(b_id, start_date, end_date);

                console.log("추가 가능한 일기 목록:", result);

                setDiaries(
                    Array.isArray(result)
                        ? result.filter((d) => !milestone_diary_ids.includes(d.d_id))
                        : []
                );

            } catch (error) {
                console.error(error);
                setDiaries([]);
            }
        };

        fetchDiaries();

    }, [b_id, navigate]);


    const toggleSelect = (d_id) => {
        setSelectedIds((prev) =>
            prev.includes(d_id)
                ? prev.filter((id) => id !== d_id)
                : [...prev, d_id]
        );
    };


    const handleDetail = (e, diary) => {
        e.stopPropagation();
        console.log("선택한 일기:", diary);
        setDetailDiary(diary);
    };


    const handleCreate = async () => {
        if (!selectedCoverId) {
            showAlert("표지 테마를 선택해주세요.", "error");
            return;
        }

        if (
            typeof required_additional_count === "number" &&
            selectedIds.length !== required_additional_count
        ) {
            showAlert(
                `동화책을 만들기 위해 일기를 정확히 ${required_additional_count}개 선택해주세요. (현재: ${selectedIds.length}개)`,
                "error"
            );
            return;
        }

        setLoading(true);
        startTipRotation();

        try {
            const selectedCover = COVER_OPTIONS.find(c => c.id === selectedCoverId);

            await createEBook(
                {
                    b_id,
                    start_date,
                    end_date,
                    s_fcover: selectedCover ? selectedCover.front : "없음",
                    s_bcover: selectedCover ? selectedCover.back : "없음",
                    s_creator: "",
                    s_comment: "",
                },
                [...milestone_diary_ids, ...selectedIds]
            );

            showAlert("디지털북이 생성되었습니다!");

            navigate("/ebook");

        } catch (error) {
            console.error(error);

            const msg =
                error.response?.data?.detail ||
                "생성에 실패했습니다.";

            showAlert(msg, "error");

        } finally {
            stopTipRotation();
            setLoading(false);
        }
    };


    return (
        <div className="ebook-create-page">

            <div className="create-header">

                <h2>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F07C60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-8px", marginRight: "8px" }}>
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    일기 추가 선택
                </h2>

                <p>
                    책에 포함할 표지 테마와 일기를 선택하세요.
                </p>

            </div>


            <div className="create-card">

                <h4 className="cover-select-title">표지 테마 선택</h4>
                <div className="cover-options-container">
                    {COVER_OPTIONS.map((cover) => (
                        <div 
                            key={cover.id}
                            onClick={() => setSelectedCoverId(prev => prev === cover.id ? null : cover.id)}
                            className={`cover-option-item ${selectedCoverId === cover.id ? "active" : ""}`}
                        >
                            <div className="cover-option-header">
                                <div className={`cover-check-circle ${selectedCoverId === cover.id ? "checked" : ""}`}>
                                    {selectedCoverId === cover.id ? "✓" : ""}
                                </div>
                                <p className="cover-option-name">
                                    {cover.name}
                                </p>
                            </div>

                            <div className="cover-thumbnails">
                                <div className="cover-thumbnail">
                                    <img src={`${BACKEND_URL}/${cover.front}`} alt="앞표지" />
                                </div>
                                <div className="cover-thumbnail">
                                    <img src={`${BACKEND_URL}/${cover.back}`} alt="뒷표지" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="create-divider" />

                <h4 className="diary-select-title">일기 선택</h4>

                {typeof required_additional_count === "number" && (
                    <p className="ebook-selected-count">
                        {required_additional_count > 0
                            ? `마일스톤 일기 ${milestone_diary_ids.length}개 선택됨 — 동화책 완성을 위해 일기를 정확히 ${required_additional_count}개 더 선택해주세요.`
                            : `마일스톤 일기 ${milestone_diary_ids.length}개로 동화책 조건을 채웠어요. 추가로 일기를 선택하지 않아도 됩니다.`}
                    </p>
                )}

                {diaries.length === 0 ? (

                    <p className="empty-diary-msg">
                        추가 가능한 일기가 없습니다.
                    </p>

                ) : (

                    <ul className="ebook-diary-list">

                        {diaries.map((diary) => (

                            <li
                                key={diary.d_id}

                                className={
                                    `ebook-diary-item ${
                                        selectedIds.includes(diary.d_id)
                                            ? "selected"
                                            : ""
                                    }`
                                }

                                onClick={() =>
                                    toggleSelect(diary.d_id)
                                }
                            >

                                <div className="ebook-diary-info">

                                    <p className="ebook-diary-title">
                                        {diary.d_title}
                                    </p>

                                    <p className="ebook-diary-date">
                                        {diary.d_date?.substring(0, 10)}
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="ebook-diary-detail-btn"

                                    onClick={(e) =>
                                        handleDetail(e, diary)
                                    }
                                >
                                    자세히 보기
                                </button>

                            </li>

                        ))}

                    </ul>

                )}


                <p className="ebook-selected-count">
                    선택한 일기: {selectedIds.length}개
                </p>


                <button
                    className="create-submit"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {
                        loading
                            ? "생성 중..."
                            : (
                                <>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-5px", marginRight: "8px" }}>
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                    디지털북 생성하기
                                </>
                            )
                    }
                </button>

            </div>


            {/* 일기 상세 모달 */}

            {detailDiary && (

                <div
                    className="ebook-diary-modal-overlay"

                    onClick={() =>
                        setDetailDiary(null)
                    }
                >

                    <div
                        className="ebook-diary-modal"

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="ebook-diary-modal-close"

                            onClick={() =>
                                setDetailDiary(null)
                            }
                        >
                            ×
                        </button>


                        <p className="ebook-diary-modal-date">
                            {
                                detailDiary.d_date
                                    ?.substring(0, 10)
                            }
                        </p>


                        <h3 className="ebook-diary-modal-title">
                            {detailDiary.d_title}
                        </h3>


                        {detailDiary.d_image && (

                            <SecureImage
                                path={detailDiary.d_image}
                                alt={detailDiary.d_title}
                                className="ebook-diary-modal-image"
                            />

                        )}


                        <div className="ebook-diary-modal-content">
                            {
                                detailDiary.d_content ||
                                "작성된 일기 내용이 없습니다."
                            }
                        </div>


                        <button
                            type="button"
                            className="ebook-diary-modal-confirm"

                            onClick={() =>
                                setDetailDiary(null)
                            }
                        >
                            확인
                        </button>

                    </div>

                </div>

            )}

            {loading && (
                <div className="diary-loading-overlay">
                    <div className="diary-loading-card">
                        <div className="diary-loading-spinner" />
                        <p className="diary-loading-header">디지털북 제작 중</p>
                        <p key={tipIndex} className="diary-loading-tip">
                            {EBOOK_LOADING_MESSAGES[tipIndex % EBOOK_LOADING_MESSAGES.length]}
                        </p>
                    </div>
                </div>
            )}

            <NaviBar />

        </div>
    );
}

export default EBookDiarySelect;