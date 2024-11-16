import React, { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../api/auth";
import {
  getAccessToken,
  clearTokens,
} from "../utils/tokenUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const accessToken = getAccessToken();
        if (accessToken) {
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          clearTokens();
        }
      } catch (err) {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  
  const login = async (email, password) => {
    try {
      const userData = await loginApi(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  
  const register = async (formData) => {
    try {
      const userData = await registerApi(
        formData.email,
        formData.password1,
        formData.password2
      );
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      clearTokens();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.is_staff || false; 

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login, 
        register, 
        logout, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
