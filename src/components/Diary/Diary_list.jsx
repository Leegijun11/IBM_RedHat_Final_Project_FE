import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryList, deleteDiary } from "../../Services/diary_api";

function Diary_list() {
    const navigate = useNavigate();

    const [diaryList, setDiaryList] = useState([]);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // 일기 목록 조회
    const handleCreateDiaryList = async () => {
        try {
            const u_id = localStorage.getItem("u_id");

            const result = await getDiaryList(u_id, selectedDate);

            console.log(result);

            if (Array.isArray(result)) {
                setDiaryList(result);
            } else if (Array.isArray(result?.diary)) {
                setDiaryList(result.diary);
            } else {
                setDiaryList([]);
            }

        } catch (error) {
            console.log(error);
            alert("일기를 불러오는데 실패하였습니다.");
        }
    };

    useEffect(() => {

        const u_id = localStorage.getItem("u_id");

        if (!u_id) {
            alert("로그인이 필요합니다.");
            navigate("/");
            return;
        }

        handleCreateDiaryList();

    }, [selectedDate]);

    // 삭제
    const handleDeleteDiary = async (d_id) => {

        const check = window.confirm("정말 삭제하시겠습니까?");

        if (!check) return;

        try {

            await deleteDiary(d_id);

            alert("일기가 삭제되었습니다.");

            handleCreateDiaryList();

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
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "10px"
                        }}
                    >
                        <h3>{diary.d_title}</h3>

                        <p>{diary.d_content}</p>

                        <p>식사 : {diary.d_eat}</p>

                        <p>수면 : {diary.d_sleep}</p>

                        <p>화장실 : {diary.d_toilet}</p>

                        <p>{diary.d_date}</p>

                        <button
                            onClick={() => handleDeleteDiary(diary.d_id)}
                        >
                            삭제
                        </button>
                    </div>
                ))
            )}

            {/* + 버튼 */}
            <button
                onClick={() => navigate("/diary/write")}
                style={{position: "fixed",bottom: "90px",right: "30px",width: "60px",height: "60px",borderRadius: "50%",fontSize: "30px",backgroundColor: "#ff8a65",color: "white",border: "none",cursor: "pointer"}}>+</button>
        </div>
    );
}

export default Diary_list;