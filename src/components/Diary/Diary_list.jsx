import { useEffect, useState } from "react";
import { getDiaryList, deleteDiary } from "../../Services/diary_api";

function Diary_list() {
    const [diaryList, setDiaryList] = useState([]);

    // 일기 목록 조회 ( R )
    const handleCreateDiaryList = async () => {

        try {

            const result = await getDiaryList();

            console.log(result);

            setDiaryList(result);
        } catch (error) {
            console.log(error);

            alert("일기를 불러오는데 실패하였습니다.");
        }
    };

    useEffect (() => {
        handleCreateDiaryList();
    }, []);

        // 일기 삭제 ( D )
    const handleDeleteDiary = async (d_id) => {
         try {

            await deleteDiary(d_id);

            alert("일기가 삭제되었습니다.")

            handleCreateDiaryList();
         } catch (error){

            console.log(error);

            alert("일기 삭제에 실패하였습니다.")
         }
    };

    return (
        <div>
            <h2>일기 목록</h2>

            {diaryList.map((diary) => (
                <div key={diary.d_id}>

                    <h3>{diary.d_title}</h3>

                    <p>{diary.d_content}</p>

                    <p>{diary.d_date}</p>

                    <button onClick={() => handleDeleteDiary(diary.d_id)}>삭제</button>
                </div>
            ))}
        </div>
    );

}

export default Diary_list;