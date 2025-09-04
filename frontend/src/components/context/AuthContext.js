import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const login = async (username, password, rememberMe) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        return { success: false, message: msg };
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setLoggedInUser(data.username);
      setIsLoading(false);

      localStorage.setItem("jwtToken", data.token);
      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("rememberMe");
      }

      return { success: true, message: "Đăng nhập thành công!" };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: "Lỗi kết nối server" };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: isLoggedIn, isLoading, login, logout, loggedInUser, setLoggedInUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
