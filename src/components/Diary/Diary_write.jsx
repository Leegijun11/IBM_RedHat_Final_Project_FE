import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Diary_write() {
    const navigate = useNavigate();
    
    const [record, setRecord] = useState("");
    const [image, setImage] = useState(null);

    // 권한 체크
    useEffect(() => {

        const my_id = localStorage.getItem("my_id");

        if (!my_id) {

            alert("로그인이 필요한 서비스 입니다.");
            navigate("/");
        }
    }, []);

    // 기록 저장 
    const handleSaveRecord = async (e) => {
        e.preventDefault();

        try {

            // 추후 기록 저장 API 연결 필요

            console.log("오늘의 기록 : ", record);
            console.log("업로드 사진 : ", image);

            alert("기록이 저장되었습니다.");

            //입력값 초기화
            setRecord("");
            setImage(null);

        } catch (error) {

            console.log(error);

            alert("기록 저장에 실패하였습니다.");
        }
    };

    return (
        <div>
            <h2>오늘의 기록</h2>

            <form onSubmit={handleSaveRecord}>

                <textarea placeholder="오늘 있었던 일을 기록하여 주세요." value={record} onChange={(e) => setRecord(e.target.value)} rows="8" cols="50" /> <br />

                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/> <br />

                <button type="submit">기록 저장</button>

            </form>
        </div>
    );
}

export default Diary_write;