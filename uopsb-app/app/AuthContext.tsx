"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextValue {
  isLoggedIn: boolean;
  user: any | null;
  newLogin: (credentialResponse: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  newLogin: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      login(userToken);
    }
  }, []);

  const newLogin = async (credentialResponse: any) => {
    const userToken = credentialResponse.credential;
    login(userToken);
  };

  const login = async (userToken: any) => {
    const decodedUser = jwtDecode(userToken);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(decodedUser),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUser(data.user);
        localStorage.setItem("userToken", userToken);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, newLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
