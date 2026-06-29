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
                if (babies && babies.length > 0) {
                    setBId(babies[0].b_id);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBaby();
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setContent("");
    };

    const handleSave = async () => {
        if (!content.trim()) {
            alert("내용을 입력해주세요");
            return;
        }

        if (!bId) {
            alert("아기 정보를 불러오지 못했습니다.");
            return;
        }

        try {
            await createOrUpdateLog({
                l_content: content,
                b_id: bId,
            });
            alert("오늘의 기록이 저장되었습니다.");
            handleClose();
        } catch (error) {
            console.log(error);
            alert("기록 저장에 실패했습니다.");
        }
    };

    return (
        <div style={{border: "1px solid #ccc", borderRadius: "15px", padding: "20px", marginBottom: "20px"}}>

            <h2>오늘의 기록</h2>

            <p>오늘 있었던 일을 기록해보세요.</p>

            <button onClick={handleOpen}>기록하기</button>

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={handleClose}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            padding: "20px",
                            width: "300px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>오늘의 기록</h3>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="오늘 있었던 일을 적어주세요"
                            rows={5}
                            style={{ width: "100%", borderRadius: "8px", padding: "10px" }}
                        />

                        <br />
                        <br />

                        <button onClick={handleSave}>저장</button>
                        <button onClick={handleClose} style={{ marginLeft: "10px" }}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Record_card;