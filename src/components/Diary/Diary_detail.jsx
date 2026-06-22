import { useState } from "react";
import { getDiaryDetail } from "../../Services/diary_api"

function Diary_detail() {
    const [d_id, setD_id] = useState("");
    const [diary, setDiary] = useState(null);

    // 일기 상세 조회 ( R )
    const handleCreateDiaryDetail = async () => {
         
        try {

            const result = await getDiaryDetail(d_id);

            console.log(result);

            setDiary(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input type="number" placeholder="일기 번호" value={d_id} onChange={(e) => setD_id(e.target.value)}/>

            <button onClick={handleCreateDiaryDetail}>조회</button>

            {diary && (
                <>
                    <h3>{diary.d_title}</h3>

                    <p>{diary.d_content}</p>

                    <p>식사 : {diary.d_eat}</p>

                    <p>수면 : {diary.d_sleep}</p>

                    <p>화장실 : {diary.d_toilet}</p>

                    <p>체온 : {diary.d_temp}</p>
                </>
            )}
        </div>
    );
}

export default Diary_detail;