import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/userApi";

function MyPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await getCurrentUser(1);

      setUser(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {user && (
        <>
          <h2>{user.u_name}</h2>
          <p>{user.u_email}</p>
        </>
      )}
    </div>
  );
}

export default MyPage;