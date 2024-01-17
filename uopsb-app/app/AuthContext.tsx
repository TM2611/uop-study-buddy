"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextValue {
  isLoggedIn: boolean;
  login: (credentialResponse: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginUser = async (decodedToken: any) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decodedToken),
      });

      const data = await response.json();

      // Catch errors between client and server
      if (response.ok) {
        console.log(data.message);
        setIsLoggedIn(true);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const login = async (credentialResponse: any) => {
    console.log("Attempting to login:", credentialResponse);
    const decodedToken = jwtDecode(credentialResponse.credential);
    await loginUser(decodedToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    console.log("Logout");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
