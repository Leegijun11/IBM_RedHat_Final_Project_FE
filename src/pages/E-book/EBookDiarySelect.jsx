import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createEBook } from "../../services/ebook_api";
import { useModal } from "../../hooks/useModal";
import NaviBar from "../../components/common/NaviBar";
import "../../styles/EBookCreate.css";
import "../../styles/Diary.css";

import api from "../../hooks/api";

const getSelectableDiaries = async (b_id) => {
    const response = await api.get("/stories/select_diaries", {
        params: { b_id }
    });

    return response.data;
};


// 이미지 URL 생성
const getDiaryImageUrl = (image) => {
    if (!image) return null;

    const normalized = image.replace(/\\/g, "/");

    // 이미 완전한 URL인 경우
    if (
        normalized.startsWith("http://") ||
        normalized.startsWith("https://")
    ) {
        return normalized;
    }

    // uploads/images/14/날짜/파일명
    // → http://localhost:8000/images/14/날짜/파일명
    if (normalized.includes("uploads/images/")) {
        const path = normalized.split("uploads/images/")[1];

        return `http://localhost:8000/images/${path}`;
    }

    // ../images/14/날짜/파일명
    // images/14/날짜/파일명
    // /images/14/날짜/파일명
    // → http://localhost:8000/images/14/날짜/파일명
    if (normalized.includes("images/")) {
        const path = normalized.split("images/")[1];

        return `http://localhost:8000/images/${path}`;
    }

    // 파일명만 저장된 경우
    return `http://localhost:8000/images/${normalized.replace(/^\/+/, "")}`;
};


function EBookDiarySelect() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { showAlert } = useModal(); 

    const {
        b_id,
        start_date,
        end_date
    } = state || {};

    //디지털북 생성 로딩창
    const [diaries, setDiaries] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailDiary, setDetailDiary] = useState(null);

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
                const result = await getSelectableDiaries(b_id);

                console.log("추가 가능한 일기 목록:", result);

                setDiaries(
                    Array.isArray(result)
                        ? result
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
        // 자세히 보기 클릭 시 일기 선택 방지
        e.stopPropagation();

        console.log("선택한 일기:", diary);
        console.log("d_image 값:", diary.d_image);
        console.log(
            "최종 이미지 URL:",
            getDiaryImageUrl(diary.d_image)
        );

        setDetailDiary(diary);
    };


    const handleCreate = async () => {
        setLoading(true);
        startTipRotation();

        try {
            await createEBook(
                {
                    b_id,
                    start_date,
                    end_date,
                    s_fcover: "",
                    s_bcover: "",
                    s_creator: "",
                    s_comment: "",
                },
                selectedIds
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

                <h2>📖 일기 추가 선택</h2>

                <p>
                    마일스톤 미달성 일기 중 책에 포함할 일기를 선택하세요.
                    <br />
                    (선택 안 해도 됩니다)
                </p>

            </div>


            <div className="create-card">

                {diaries.length === 0 ? (

                    <p
                        style={{
                            color: "#A3968C",
                            textAlign: "center"
                        }}
                    >
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
                            : "📖 디지털북 생성하기"
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

                            <img
                                className="ebook-diary-modal-image"

                                src={
                                    getDiaryImageUrl(
                                        detailDiary.d_image
                                    )
                                }

                                alt={detailDiary.d_title}
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