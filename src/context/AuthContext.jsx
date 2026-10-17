"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import client from "@/utils/helper";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("nestro_token");
        const savedUserStr = localStorage.getItem("nestro_user");

        if (savedToken) {
          setToken(savedToken);
          if (savedUserStr) {
            try {
              setUser(JSON.parse(savedUserStr));
            } catch {
              // ignore json parse error
            }
          }

          // Fetch fresh user profile from backend
          try {
            const res = await client.get("/api/user/me");
            if (res.data?.success && res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem("nestro_user", JSON.stringify(res.data.user));
            }
          } catch (err) {
            // Token might be invalid or expired
            if (err.response?.status === 401) {
              logout();
            }
          }
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("nestro_token", userToken);
      localStorage.setItem("nestro_user", JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await client.post("/api/user/logout");
    } catch {
      // ignore logout network errors
    }
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nestro_token");
      localStorage.removeItem("nestro_user");
    }
  };

  const refreshUser = async () => {
    try {
      const res = await client.get("/api/user/me");
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("nestro_user", JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
    return null;
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshUser,
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

export default AuthContext;
