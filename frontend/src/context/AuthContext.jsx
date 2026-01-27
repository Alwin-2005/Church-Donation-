import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserFromToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (userFromToken) {
      setUser(userFromToken);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
