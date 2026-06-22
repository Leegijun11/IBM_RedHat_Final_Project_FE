import { useState } from "react";
import { editDiary } from "../../Services/diary_api";

function Diary_edit() {
    const [d_id, setD_id] = useState("");
    const [d_title, setD_title] = useState("");
    const [d_content, setD_content] = useState("");
    const [d_label, setD_label] = useState("");
    const [d_eat, setD_eat] = useState("");
    const [d_sleep, setD_sleep] = useState("");
    const [d_toilet, setD_toilet] = useState("");
    const [d_temp, setD_temp] = useState("");

    // 일기 수정 ( U )
    const handleCreateDiary = async (e) => {
        e.preventDefault();

        try {
            const result = await editDiary({d_id, d_title, d_content, d_label, d_eat, d_sleep, d_toilet, d_temp});
            
            console.log(result);
        } catch (error){

            console.log(error);
        }
    };

    return (
        <div>
            <h2>일기 수정</h2>

            <form onSubmit={handleCreateDiary}>

                <input type="number" placeholder="일기 ID" value={d_id} onChange={(e) => setD_id(e.target.value)}/>
                <input type="text" placeholder="제목" value={d_title} onChange={(e) => setD_title(e.target.value)}/>
                <textarea placeholder="내용" value={d_content} onChange={(e) => setD_content(e.target.value)}/>
                
                <button type="submit">수정</button>
            </form>
        </div>
    );
}

export default Diary_edit;