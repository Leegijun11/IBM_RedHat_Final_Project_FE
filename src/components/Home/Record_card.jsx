import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateLog } from "../../services/logs_api";
import { getBabies } from "../../services/baby_api";
import { getCurrentBaby } from "../../services/partner_api";
import { getAgeInMonths, getTipPool } from "../../services/milestoneTips";
import { useModal } from "../../hooks/useModal";

function Record_card() {
    const navigate = useNavigate();
    const [bId, setBId] = useState(null);
    const [babyBirth, setBabyBirth] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const { showAlert } = useModal(); 
    const [isLoading, setIsLoading] = useState(false);
    const [tipPool, setTipPool] = useState([]);
    const [tipIndex, setTipIndex] = useState(0);
    const tipTimerRef = useRef(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                if (baby) {
                    setBId(baby.b_id);
                    setBabyBirth(baby.b_birth || null);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBaby();
    }, []);

    const startTipRotation = () => {
        const pool = getTipPool(getAgeInMonths(babyBirth));
        setTipPool(pool);
        setTipIndex(0);
        let i = 0;
        tipTimerRef.current = setInterval(() => {
            i = (i + 1) % pool.length;
            setTipIndex(i);
        }, 3500);
    };

    const stopTipRotation = () => {
        if (tipTimerRef.current) {
            clearInterval(tipTimerRef.current);
            tipTimerRef.current = null;
        }
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setContent("");
        stopTipRotation();
        setIsLoading(false);
    };

    const handleViewOpen = (e) => {
        e.stopPropagation();
        navigate("/record-calendar");
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!content.trim()) { showAlert("내용을 입력해주세요", "error"); return; }
        if (!bId) { showAlert("아기 정보를 불러오지 못했습니다.", "error"); return; }

        setIsLoading(true);
        startTipRotation();

        try {
            await createOrUpdateLog({ l_content: content, b_id: bId });
            setContent("");
            handleClose();
            setShowMenu(false);
        } catch (error) {
            console.log(error);
            showAlert("기록 저장에 실패했습니다.", "error");
        } finally {
            stopTipRotation();
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="action-click-card record-bg" onClick={toggleMenu}>
                <div className="action-icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }}>
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                </div>

                {!showMenu ? (
                    <div className="photo-card-default">
                        <h2>오늘의 기록</h2>
                        <p>수유·수면·기저귀</p>
                        <span className="action-card-btn">탭하여 선택</span>
                    </div>
                ) : (
                    <div className="photo-card-menu">
                        <button className="photo-menu-btn" onClick={handleOpen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            기록 작성
                        </button>
                        <button className="photo-menu-btn" onClick={handleViewOpen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }}><rect x="3" y="4" width="18" height="18" rx="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            기록 조회
                        </button>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="custom-modal-overlay" onClick={handleClose}>
                    <div className="custom-modal-body" onClick={(e) => e.stopPropagation()}>
                        <h3>오늘의 기록</h3>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="오늘 있었던 일을 적어주세요 (수유, 수면 시간 등)"
                            rows={5}
                        />
                        <div className="modal-btn-row">
                            <button className="modal-btn-save" onClick={handleSave}>저장</button>
                            <button className="modal-btn-cancel" onClick={handleClose}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && tipPool.length > 0 && (
                <div className="diary-loading-overlay">
                    <div className="diary-loading-card">
                        <div className="diary-loading-spinner" />
                        <p className="diary-loading-header">오늘의 기록 작성 TIP</p>
                        <p key={tipIndex} className="diary-loading-tip">
                            {tipPool[tipIndex % tipPool.length]}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Record_card;