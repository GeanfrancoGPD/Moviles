import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, logout as apiLogout } from "../../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (gmail, password) => {
    const userData = await apiLogin(gmail, password);
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateUserSession = async (updatedUser) => {
    setUser((currentUser) => ({ ...currentUser, ...updatedUser }));
    const currentStored = await AsyncStorage.getItem("user");
    const storedUser = currentStored ? JSON.parse(currentStored) : {};
    const nextUser = { ...storedUser, ...updatedUser };
    await AsyncStorage.setItem("user", JSON.stringify(nextUser));
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};