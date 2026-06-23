import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiaryDetail } from "../../Services/diary_api"

function Diary_detail() {
    const navigate = useNavigate();

    const [d_id, setD_id] = useState("");
    const [diary, setDiary] = useState(null);

    useEffect(() => {
        const my_id = localStorage.getItem("my_id");

        if (!my_id) {

            alert("로그인이 필요한 서비스 입니다.");
            navigate("/");
        }
    }, []);

    // 일기 상세 조회 ( R )
    const handleCreateDiaryDetail = async () => {
         
        try {

            const result = await getDiaryDetail(d_id);

            console.log(result);

            setDiary(result);

        } catch (error) {
            console.log(error);
            alert("일기 조회에 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>일기 상세 조회</h2>

            <input type="number" placeholder="일기 번호" value={d_id} onChange={(e) => setD_id(e.target.value)}/>

            <button onClick={handleCreateDiaryDetail}>조회</button>

            {diary && (
                <div>

                    <h3>{diary.d_title}</h3>

                    <p>{diary.d_content}</p>
                    
                    <p>라벨 : {diary.d_label}</p>

                    <p>식사 : {diary.d_eat}</p>

                    <p>수면 : {diary.d_sleep}</p>

                    <p>화장실 : {diary.d_toilet}</p>

                    <p>체온 : {diary.d_temp}</p>

                    <p>작성일 : {diary.d_date}</p>
                    
                </div>

            )}
        </div>
    );
}

export default Diary_detail;