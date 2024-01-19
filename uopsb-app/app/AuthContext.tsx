"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextValue {
  isLoggedIn: boolean;
  user: any | null;
  login: (credentialResponse: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const loginUser = async (decodedToken: any) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decodedToken),
      });

      const data = await response.json();

      if (response.ok) {
          console.log(data.message);
          console.log(data.user);
          setIsLoggedIn(true);
          setUser(data.user)
          // Catch errors between client and server
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const login = async (credentialResponse: any) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    await loginUser(decodedToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    console.log("Logout");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
