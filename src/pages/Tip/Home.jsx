import { useEffect, useState } from "react";
import { getTipList } from "../../services/tipApi";

function Home() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const result = await getTipList();

      setTips(result);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>AI 발달 팁</h1>

      {tips.map((tip) => (
        <div key={tip.t_id}>
          <h3>{tip.t_title}</h3>

          <p>{tip.t_age}개월</p>
        </div>
      ))}
    </div>
  );
}

export default Home;