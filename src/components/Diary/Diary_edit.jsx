import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { editDiary } from "../../Services/diary_api";

function Diary_edit() {
    const navigate = useNavigate();

    const [d_id, setD_id] = useState("");
    const [d_title, setD_title] = useState("");
    const [d_content, setD_content] = useState("");
    const [d_label, setD_label] = useState("");
    const [d_eat, setD_eat] = useState("");
    const [d_sleep, setD_sleep] = useState("");
    const [d_toilet, setD_toilet] = useState("");
    const [d_temp, setD_temp] = useState("");

    useEffect (() => {
        const my_id = localStorage.getItem("my_id");

        if (!my_id) {

            alert("로그인이 필요한 서비스 입니다.");
            navigate("/");
        }
    }, []);

    // 일기 수정 ( U )
    const handleCreateDiary = async (e) => {
        e.preventDefault();

        try {
            const result = await editDiary({d_id, d_title, d_content, d_label, d_eat, d_sleep, d_toilet, d_temp});
            
            console.log(result);

            alert("일기가 수정되었습니다.")

            // 입력값 초기화
            setD_id("");
            setD_title("");
            setD_content("");
            setD_label("");
            setD_eat("");
            setD_sleep("");
            setD_toilet("")
            setD_temp("");


        } catch (error){

            console.log(error);

            alert("일기 수정에 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>일기 수정</h2>

            <form onSubmit={handleCreateDiary}>

                <input type="number" placeholder="일기 ID" value={d_id} onChange={(e) => setD_id(e.target.value)}/>
                <input type="text" placeholder="제목" value={d_title} onChange={(e) => setD_title(e.target.value)}/>
                <textarea placeholder="내용" value={d_content} onChange={(e) => setD_content(e.target.value)}/>
                <input type="texy" placeholder="라벨" value={d_label} onChange={(e) => setD_label(e.target.value)}/>
                <input type="texy" placeholder="식사" value={d_eat} onChange={(e) => setD_eat(e.target.value)}/>
                <input type="texy" placeholder="수면" value={d_sleep} onChange={(e) => setD_sleep(e.target.value)}/>
                <input type="texy" placeholder="화장실" value={d_toilet} onChange={(e) => setD_toilet(e.target.value)}/>
                <input type="texy" placeholder="체온" value={d_temp} onChange={(e) => setD_temp(e.target.value)}/>
                
                <button type="submit">수정</button>
            </form>
        </div>
    );
}

export default Diary_edit;