import Diary_write from "../../Components/Diary/Diary_write";
import Diary_list from "../../Components/Diary/Diary_list";
import Diary_detail from "../../Components/Diary/Diary_detail";
import Diary_edit from "../../Components/Diary/Diary_edit";

const Diary = () => {
    return (
        <div>
            <Diary_write />

            <Diary_list />

        </div>
    );
};

export default Diary;