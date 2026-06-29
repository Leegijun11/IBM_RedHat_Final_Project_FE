import { useState, useEffect } from "react";
import { getMe } from "../services/user_api";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = !!user;

  return { user, login, logout, isLoggedIn, loading, checkAuth };
}

export default useAuth;