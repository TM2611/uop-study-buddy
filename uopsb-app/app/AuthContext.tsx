"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useLocalStorage } from "./_hooks/useLocalStorage";

interface AuthContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: any | null;
  storageToken: string | null;
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
  storageToken: "",
  googleLogin: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [storageToken, setStorageToken] = useLocalStorage("userToken", "");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!storageToken);

  useEffect(() => {
    if (storageToken && !isLoggedIn) {
      login(storageToken);
    } else if (isLoggedIn) {
      getUserFromAPI(storageToken);
    }
  }, [isLoggedIn, storageToken]);

  debugger;

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken && !isLoggedIn) {
      login(userToken);
    } else if (isLoggedIn) {
      getUserFromAPI(storageToken);
    }
  }, [isLoggedIn, storageToken]);

  const googleLogin = async (credentialResponse: any) => {
    const userToken = credentialResponse.credential;
    login(userToken);
  };

  const getUserFromAPI = async (userToken: string) => {
    try {
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(jwtDecode(userToken)),
      });
      if (loginRes.ok) {
        const data = await loginRes.json();
        const user = data.user;
        setUser(user);
      } else {
        console.error("An error occurred while getting user:", loginRes);
      }
    } catch (error) {
      console.error("An error occurred while getting user:", error);
    }
  };

  const login = async (userToken: any) => {
    setStorageToken(userToken);
    setIsLoggedIn(true);
    localStorage.setItem("userToken", userToken);
    // Call getUserFromAPI to fetch the user data upon successful login
    await getUserFromAPI(userToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        storageToken,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
