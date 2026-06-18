import { useState } from "react";
import { updateUser } from "../../services/userApi";

function EditProfile() {
  const [data, setData] = useState({
    u_pw: "",
    u_name: "",
    u_nickname: "",
    u_email: "",
    u_phone: "",
  });

  const handleUpdate = async () => {
    try {
      const result = await updateUser(data);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleUpdate}>
      수정
    </button>
  );
}

export default EditProfile;