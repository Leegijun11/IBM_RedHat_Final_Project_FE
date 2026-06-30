import { useState, useEffect } from "react";
import { createOrUpdateLog } from "../../services/logs_api";
import { getBabies } from "../../services/baby_api";

function Record_card() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const [bId, setBId] = useState(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const babies = await getBabies();
                if (babies && babies.length > 0) { setBId(babies[0].b_id); }
            } catch (error) { console.log(error); }
        };
        fetchBaby();
    }, []);

    const handleOpen = () => { setIsOpen(true); };
    const handleClose = () => { setIsOpen(false); setContent(""); };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!content.trim()) { alert("내용을 입력해주세요"); return; }
        if (!bId) { alert("아기 정보를 불러오지 못했습니다."); return; }
        try {
            await createOrUpdateLog({ l_content: content, b_id: bId });
            alert("오늘의 기록이 저장되었습니다.");
            handleClose();
        } catch (error) {
            console.log(error);
            alert("기록 저장에 실패했습니다.");
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
        </>
    );
}

export default Record_card;