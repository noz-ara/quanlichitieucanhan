import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Khi reload page vẫn giữ login
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (token && username) {
      setIsLoggedIn(true);
      setLoggedInUser({ username, role });
    }
  }, []);

  const login = async (username, password, rememberMe) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setIsLoading(false);
        return { success: false, message: msg };
      }

      const data = await response.json();

      // Lưu token + user info
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      setIsLoggedIn(true);
      setLoggedInUser({ username: data.username, role: data.role });
      setIsLoading(false);

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
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("rememberMe");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isLoggedIn,
        isLoading,
        login,
        logout,
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
