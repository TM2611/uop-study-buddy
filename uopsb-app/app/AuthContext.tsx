"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextValue {
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: any | null;
  token: string | null;
  setToken: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<any | null>>;
  googleLogin: (credentialResponse: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  token: "",
  setToken: () => {},
  setUser: () => {},
  googleLogin: () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      login(userToken);
    } else if (path !== "/") {
      router.push("/");
    }
    setLoading(false);
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
    setToken("");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setToken,
        setUser,
        token,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
