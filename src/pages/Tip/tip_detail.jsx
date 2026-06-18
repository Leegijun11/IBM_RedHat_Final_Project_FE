import { useEffect, useState } from "react";
import { getTipDetail } from "../../services/tipApi";

function TipDetail() {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    fetchTip();
  }, []);

  const fetchTip = async () => {
    try {
      const result = await getTipDetail(1);

      setTip(result);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  if (!tip) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{tip.t_title}</h1>

      <h3>{tip.t_age}개월</h3>

      <p>{tip.t_content}</p>
    </div>
  );
}

export default TipDetail;