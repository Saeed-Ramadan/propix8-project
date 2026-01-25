import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext.js";

// BroadcastChannel for cross‑tab token sync
const bc = new BroadcastChannel("auth_token_channel");
const broadcastToken = (newToken) => {
  bc.postMessage({ type: "TOKEN_UPDATED", token: newToken });
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });

  // ---------- Auth helpers ----------
  const login = (newToken, data) => {
    localStorage.setItem("userToken", newToken);
    localStorage.setItem("userData", JSON.stringify(data));
    setToken(newToken);
    setUserData(data);
    broadcastToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("user"); // legacy key
    setToken(null);
    setUserData(null);
    broadcastToken(null);
    navigate("/signin");
  };

  const updateUser = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);
  };

  // No dedicated refresh endpoint exists. If needed, you can implement a custom refresh
  // mechanism here later. For now we expose a placeholder that simply resolves.
  const refreshToken = useCallback(async () => {
    // Placeholder – no backend endpoint available.
    return;
  }, []);

  // Listen for token updates from other tabs/windows
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "TOKEN_UPDATED") {
        const newTok = e.data.token;
        if (newTok) {
          localStorage.setItem("userToken", newTok);
        } else {
          localStorage.removeItem("userToken");
        }
        setToken(newTok);
      }
    };
    bc.addEventListener("message", handler);
    return () => bc.removeEventListener("message", handler);
  }, []);

  // Optional periodic check – can be used to verify token validity if you have expiry info.
  // Currently does nothing but kept for future extension.
  useEffect(() => {
    const interval = setInterval(
      () => {
        // e.g., decode JWT and if near expiry call refreshToken()
      },
      5 * 60 * 1000,
    ); // every 5 minutes
    return () => clearInterval(interval);
  }, [refreshToken]);

  // Refresh user profile after login (if token present)
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("userToken");
    if (!currentToken) return;
    try {
      const response = await fetch("https://propix8.com/api/profile", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();
      if (result.status) {
        updateUser(result.data);
      }
    } catch (error) {
      console.error("AuthContext: Error refreshing user data:", error);
    }
  }, []);

  const refreshAttempted = useRef(false);
  useEffect(() => {
    if (token && !userData && !refreshAttempted.current) {
      refreshAttempted.current = true;
      setTimeout(() => {
        refreshUser();
      }, 0);
    }
  }, [token, refreshUser, userData]);

  // Sync via storage event (for other windows)
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

  // Helper to ensure authentication
  const ensureAuth = (callback) => {
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً للمتابعة", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: { fontFamily: "Cairo" },
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return false;
    }
    if (callback) callback();
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        login,
        logout,
        updateUser,
        refreshUser,
        ensureAuth,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
