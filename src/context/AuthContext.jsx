import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastConfig.js";
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

  // React Query for User Profile
  const queryClient = useQueryClient();

  const fetchProfile = async () => {
    const currentToken = localStorage.getItem("userToken");
    if (!currentToken) return null;

    const response = await fetch("https://propix8.com/api/profile", {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      // If 401, token might be invalid. Let the query fail or handle logout.
      // For now we just return null or throw.
      throw new Error("Failed to fetch profile");
    }

    const result = await response.json();
    return result.status ? result.data : null;
  };

  const { data: queryUserData } = useQuery({
    queryKey: ["userProfile", token],
    queryFn: fetchProfile,
    enabled: !!token,
    refetchInterval: 10000, // Poll every 10 seconds
    retry: false, // Don't retry if it fails (e.g. 401)
  });

  // Sync Query Data with Local State & Storage
  useEffect(() => {
    if (queryUserData) {
      // Only update if data actually changed to avoid potential loops if strict equality check fails
      // However, for simplicity and ensuring sync:
      const currentStored = localStorage.getItem("userData");
      if (JSON.stringify(queryUserData) !== currentStored) {
        updateUser(queryUserData);
      }
    }
  }, [queryUserData]);

  // Manual refresh becomes invalidation
  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  }, [queryClient]);

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
      toast.error("يجب تسجيل الدخول أولاً للمتابعة", toastOptions);
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
