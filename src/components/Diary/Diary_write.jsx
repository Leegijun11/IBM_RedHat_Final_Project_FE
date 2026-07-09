import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateLog } from "../../services/logs_api";
import { uploadBabyImage } from "../../services/babyimage_api";
import { createDiary } from "../../services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";
import { getAgeInMonths, getTipPool } from "../../services/milestoneTips";
import NaviBar from "../common/NaviBar";

function Diary_write() {
    const navigate = useNavigate();

    const [record, setRecord] = useState("");
    const [image, setImage] = useState(null);
    const [bId, setBId] = useState(null);
    const [babyBirth, setBabyBirth] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [tipIndex, setTipIndex] = useState(0);
    const [tipPool, setTipPool] = useState([]);
    const tipTimerRef = useRef(null);

    useEffect(() => {
        const fetchBaby = async () => {
            try {
                const baby = await getCurrentBaby();
                setBId(baby.b_id);
                setBabyBirth(baby.b_birth || null);
            } catch (error) {
                console.log(error);
                alert("등록된 아기 정보가 없습니다.");
                navigate("/babyinfo");
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
        }, 2500);
    };

    const stopTipRotation = () => {
        if (tipTimerRef.current) {
            clearInterval(tipTimerRef.current);
            tipTimerRef.current = null;
        }
    };

    const handleSaveRecord = async (e) => {
        e.preventDefault();

        if (!record.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        if (!bId) {
            alert("아기 정보를 불러오지 못했습니다.");
            return;
        }

        setIsLoading(true);
        startTipRotation();

        try {
            await createOrUpdateLog({
                l_content: record,
                b_id: bId,
            });

            if (image) {
                await uploadBabyImage(bId, image);
            }

            const today = new Date().toISOString().split("T")[0];
            await createDiary({
                b_id: bId,
                d_date: today,
            });

            setRecord("");
            setImage(null);

            navigate("/diary");

        } catch (error) {
            console.log(error);
            alert("기록 저장에 실패하였습니다.");
        } finally {
            stopTipRotation();
            setIsLoading(false);
        }
    };

    return (
        <div className="diary-write-wrap">
            <div className="diary-write-card">
                <h2>오늘의 기록</h2>

                <form onSubmit={handleSaveRecord}>
                    <textarea
                        placeholder="오늘 있었던 일을 기록하여 주세요."
                        value={record}
                        onChange={(e) => setRecord(e.target.value)}
                        rows="8"
                        cols="50"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <div className="diary-write-btn-row">
                        <button type="submit" className="diary-write-save-btn">저장</button>
                        <button type="button" className="diary-write-cancel-btn" onClick={() => navigate("/diary")}>취소</button>
                    </div>
                </form>
            </div>

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

            <NaviBar/>
        </div>
    );
}

export default Diary_write;