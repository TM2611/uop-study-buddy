"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../app/AuthContext";

export default function Nav() {
  const { isLoggedIn, login, logout } = useAuth();

  const onLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <nav className="flex flex-row justify-between items-center w-full h-16 bg-white text-black border-b-2 border-gray-200">
      <div className="flex flex-row justify-start items-center">
        <div className="flex flex-row justify-start items-center ml-8">
          <img src="/uop.svg" alt="logo" className="scale-50" />
          <h1 className="text-xl font-bold ml-2">UOPSB</h1>
        </div>
        <div className="flex flex-row justify-start items-center ml-8">
          <a href="#" className="text-lg font-bold">
            Home
          </a>
          <a href="#" className="text-lg font-bold ml-8">
            About
          </a>
          <a href="#" className="text-lg font-bold ml-8">
            Contact
          </a>
        </div>
      </div>
      <div className="flex flex-row justify-end items-center mr-8">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-8"
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={login} onError={onLoginError} />
        )}
      </div>
    </nav>
  );
}
