import { useEffect, useState } from "react";
import { getTipList } from './../../services/tip_api';
import { useModal } from "../../hooks/useModal";

function Home() {
    const [TipList, setTipList] = useState ([]);
    const { showAlert } = useModal();

    // 팁 목록
    const handleGetTipList = async () => {

        try {

            const result = await getTipList ();

            console.log(result);

            setTipList(result);
        } catch (error) {
            console.log(error);

            showAlert("Tip 정보들을 불러오는데 실패하였습니다.");
        }
    };

    useEffect(() => {
        handleGetTipList();
    }, []);

    return (
        <div>
            <h2>AI 발달 팁</h2>

            {TipList.map((tip) =>(
                <div key={tip.t_id}>
                    <p>{tip.t_title}</p>
                    <p>{tip.t_age}개월</p>
                </div>
            ))}
        </div>
    );
}

export default Home;
