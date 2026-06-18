import { deleteUser } from "../../services/userApi";

function DeleteAccount() {
  const handleDelete = async () => {
    try {
      const result = await deleteUser(1);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleDelete}>
      계정 삭제
    </button>
  );
}

export default DeleteAccount;