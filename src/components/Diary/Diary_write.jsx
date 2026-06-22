import { useState } from "react";
import { createDiary } from "../../Services/diary_api"

function Diary_write() {
    const [b_id, setB_id,] = useState("");
    const [d_title, setD_title] = useState("");
    const [d_content, setD_content] = useState("");
    const [d_label, setD_label] = useState("");
    const [d_eat, setD_eat] = useState("");
    const [d_sleep, setD_sleep] = useState("");
    const [d_toilet, setD_toilet] = useState("");
    const [d_temp, setD_temp] = useState("");

    // 일기 작성 ( C )
    const handleCreateDiary = async (e) => {
        e.preventDefault();

        try {

            const result = await createDiary({b_id, d_title, d_content, d_label, d_eat, d_sleep, d_toilet, d_temp});

            console.log(result);

            alert("일기가 등록되었습니다.");
        } catch (error) {
            console.log (error);

            alert("일기 작성에 실패하였습니다.")
        }
    };

    return (
        <div>
            <h2>일기 작성</h2>

            <form onSubmit={handleCreateDiary}>
            <input type="number" placeholder="아기 ID" value={b_id} onChange={(e) => setB_id(e.target.value)}/>
            <input type="text" placeholder="제목" value={d_title} onChange={(e) => setD_title(e.target.value)} />
            <textarea placeholder="내용" value={d_content} onChange={(e) => setD_content(e.target.value)} />
            <input type="text" placeholder="라벨" value={d_label} onChange={(e) => setD_label(e.target.value)} />
            <input type="text" placeholder="식사" value={d_eat} onChange={(e) => setD_eat(e.target.value)} />
            <input type="text" placeholder="수면" value={d_sleep} onChange={(e) => setD_sleep(e.target.value)} />
            <input type="text" placeholder="화장실" value={d_toilet} onChange={(e) => setD_toilet(e.target.value)} />
            <input type="text" placeholder="체온" value={d_temp} onChange={(e) => setD_temp(e.target.value)} />

            <button type="submit">등록</button>
        </form>   
    </div>
    );
}

export default Diary_write;