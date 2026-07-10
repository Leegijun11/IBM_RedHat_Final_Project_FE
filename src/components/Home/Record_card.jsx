import { useState, useEffect, useRef } from "react";
import { createOrUpdateLog } from "../../services/logs_api";
import { getBabies } from "../../services/baby_api";
import { getCurrentBaby } from "../../services/partner_api";
import { getAgeInMonths, getTipPool } from "../../services/milestoneTips";


function Record_card() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [bId, setBId] = useState(null);
    const [babyBirth, setBabyBirth] = useState(null);

    // 로딩 + 팁 상태
    const [isLoading, setIsLoading] = useState(false);
    const [tipPool, setTipPool] = useState([]);
    const [tipIndex, setTipIndex] = useState(0);
    const tipTimerRef = useRef(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                // getCurrentBaby로 b_birth까지 가져오기
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

    const handleOpen = () => { setIsOpen(true); };
    const handleClose = () => {
        setIsOpen(false);
        setContent("");
        stopTipRotation();
        setIsLoading(false);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!content.trim()) { alert("내용을 입력해주세요"); return; }
        if (!bId) { alert("아기 정보를 불러오지 못했습니다."); return; }

        setIsLoading(true);
        startTipRotation();

        try {
            await createOrUpdateLog({ l_content: content, b_id: bId });
            setContent("");
            handleClose();
        } catch (error) {
            console.log(error);
            alert("기록 저장에 실패했습니다.");
        } finally {
            stopTipRotation();
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="action-click-card record-bg" onClick={handleOpen}>
                <div className="action-icon-circle">✏️</div>
                <h2>오늘의 기록</h2>
                <p>수유·수면·기저귀</p>
                <span className="action-card-btn">기록하기</span>
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

            {/* 로딩 오버레이 — 모달 밖에서 전체 화면 덮기 */}
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