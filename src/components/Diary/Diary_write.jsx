import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrUpdateLog } from "../../Services/logs_api";
import { uploadBabyImage } from "../../Services/babyimage_api";
import { createDiary } from "../../Services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";
import NaviBar from "../common/NaviBar";
function Diary_write() {
    const navigate = useNavigate();

    const [record, setRecord] = useState("");
    const [image, setImage] = useState(null);
    const [bId, setBId] = useState(null);

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

    // 기록 저장
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

        try {
            // 1. 텍스트 기록 저장
            await createOrUpdateLog({
                l_content: record,
                b_id: bId,
            });

            // 2. 사진이 있으면 저장
            if (image) {
                await uploadBabyImage(bId, image);
            }

            // 3. 오늘 날짜로 일기 생성 요청
            const today = new Date().toISOString().split("T")[0];
            await createDiary({
                b_id: bId,
                d_date: today,
            });

            alert("기록이 저장되고 일기가 생성되었습니다.");

            setRecord("");
            setImage(null);

            navigate("/diary");

        } catch (error) {
            console.log(error);
            alert("기록 저장에 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>오늘의 기록</h2>

            <form onSubmit={handleSaveRecord}>
                <textarea
                    placeholder="오늘 있었던 일을 기록하여 주세요."
                    value={record}
                    onChange={(e) => setRecord(e.target.value)}
                    rows="8"
                    cols="50"
                /> <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                /> <br />

                <button type="submit">기록 저장</button>
            </form>
            <NaviBar/>
        </div>
    );
}

export default Diary_write;