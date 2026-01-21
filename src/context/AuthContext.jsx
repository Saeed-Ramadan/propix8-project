import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const login = (newToken, data) => {
    localStorage.setItem("userToken", newToken);
    localStorage.setItem("userData", JSON.stringify(data));
    setToken(newToken);
    setUserData(data);
  };

  const updateUser = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("user"); // Clear legacy key if it exists
    setToken(null);
    setUserData(null);
    navigate("/signin");
  };

  // Helper to ensure auth or redirect
  const ensureAuth = (callback) => {
    if (!token) {
      navigate("/signin", { state: { from: window.location.pathname } });
      return false;
    }
    if (callback) callback();
    return true;
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userToken" || e.key === "userData") {
        const newToken = localStorage.getItem("userToken");
        const newUserData = localStorage.getItem("userData");
        setToken(newToken);
        setUserData(newUserData ? JSON.parse(newUserData) : null);

        if (!newToken && window.location.pathname !== "/signin") {
          navigate("/signin");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        login,
        logout,
        updateUser,
        ensureAuth,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
