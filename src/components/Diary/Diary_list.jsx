import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryList, deleteDiary } from "../../Services/diary_api";
import { getCurrentBaby } from "../../services/partner_api";

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

    return (
        <div>
            <h2>일기 목록</h2>

            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <hr />

            {diaryList.length === 0 ? (
                <p>등록된 일기가 없습니다.</p>
            ) : (
                diaryList.map((diary) => (
                    <div
                        key={diary.d_id}
                        onClick={() => navigate(`/diary/${diary.d_id}`)}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
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
                onClick={() => navigate("/diary/write")}
                style={{position: "fixed", bottom: "90px", right: "30px", width: "60px", height: "60px", borderRadius: "50%", fontSize: "30px", backgroundColor: "#ff8a65", color: "white", border: "none", cursor: "pointer"}}>+</button>
        </div>
    );
}

export default Diary_list;