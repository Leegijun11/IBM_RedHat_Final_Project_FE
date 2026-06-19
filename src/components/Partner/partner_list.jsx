import { useEffect, useState } from "react";
import { getPartnerList } from "../../services/partnerApi";

function PartnerList() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const result = await getPartnerList(1);

      setPartners(result);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>공동 양육자 목록</h1>

      {partners.map((partner, index) => (
        <div key={index}>
          <h3>{partner.u_name}</h3>

          <p>{partner.p_role}</p>
          <p>{partner.p_category}</p>
          <p>{partner.p_state}</p>
        </div>
      ))}
    </div>
  );
}

export default PartnerList;