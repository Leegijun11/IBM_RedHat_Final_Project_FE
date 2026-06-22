import useLocalStorage from "./useLocalStorage";

function useAuth() {
  const [my_id, setMy_id, removeMy_id] = useLocalStorage("u_id");

  const login = (u_id) => {
    setMy_id(u_id);
  };

  const logout = () => {
    removeMy_id();
  };

  const isLoggedIn = !!my_id;

  return { my_id, login, logout, isLoggedIn };
}

export default useAuth;