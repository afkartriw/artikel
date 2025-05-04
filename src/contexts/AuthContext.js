"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Set token ke header axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verifikasi token dan ambil profil
      const { data: profileData } = await api.get("/auth/profile");
      setUser({
        username: profileData.username,
        role: profileData.role,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Pastikan ini hanya berjalan di client side
  if (typeof window !== "undefined") {
    checkAuth();
  }
}, []);
  

  const login = async (username, password) => {
    try {
      // Step 1: Authenticate user and get token
      const { data: authData } = await api.post("/auth/login", { 
        username, 
        password 
      });
      
      // Store the token immediately
      localStorage.setItem("token", authData.token);
  
      // Step 2: Fetch user profile data
      let userProfile;
      try {
        const { data: profileData } = await api.get("/auth/profile");
        userProfile = {
          username: profileData.username || username, // Fallback to login username
          role: profileData.role || 'User' // Default to 'User' if not specified
        };
      } catch (profileError) {
        console.warn("Failed to fetch profile, using basic info:", profileError);
        userProfile = {
          username,
          role: 'User' // Default role if profile fetch fails
        };
      }
  
      // Store user data in state and localStorage
      setUser(userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));
  
      // Step 3: Redirect based on role
      router.push(userProfile.role === "Admin" ? "/admin/artikel" : "/user/artikel");
      
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      
      // Clear any partial authentication
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
  
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const register = async (username, password, role = "User") => {
    try {
      await api.post("/auth/register", { username, password, role });
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
