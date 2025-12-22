//src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { setAuth } from "../api/http";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuth({ token });
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    localStorage.clear();
    setAuth(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
