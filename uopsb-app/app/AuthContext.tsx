"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: any | null;
  token: string | null;
  googleLogin: (credentialResponse: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  token: "",
  googleLogin: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      login(userToken);
    }
  }, []);

  const googleLogin = async (credentialResponse: any) => {
    const userToken = credentialResponse.credential;
    login(userToken);
  };

  const login = async (userToken: any) => {
    setToken(userToken);
    const decodedUser = jwtDecode(userToken);
    try {
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(decodedUser), //just pass in email?
      });
      if (loginRes.ok) {
        const data = await loginRes.json();
        const user = data.user;
        if (!user) {
          router.push("/setup-form");
        }

        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem("userToken", userToken);
      } else {
        console.error("An error occurred while logging in:", loginRes);
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
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, token, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
