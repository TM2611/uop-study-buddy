"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function Nav() {
  const { isLoggedIn, googleLogin, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const onLoginError = () => {
    console.log("Login Failed");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      !(event.target instanceof Element) ||
      !event.target.closest(".dropdown-container")
    ) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <nav className="flex flex-col justify-between items-center w-full h-auto sm:h-16 bg-white text-black border-b-2 border-gray-200 sm:flex-row">
      <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-start">
        <div className="flex flex-row justify-start items-center mt-2 sm:mt-0 ml-8">
          <img src="/uop.svg" alt="logo" className="scale-50" />
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-start sm:items-center sm:space-y-0 sm:ml-8 mt-4 sm:mt-0">
          <a href="/" className="text-lg font-bold sm:ml-8">
            Home
          </a>
          <a href="/study" className="text-lg font-bold sm:ml-8">
            Study
          </a>
          <a href="/dashboard" className="text-lg font-bold sm:ml-8">
            Dashboard
          </a>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mt-4 sm:mt-0 sm:justify-end mr-8 relative dropdown-container sm:mr-8">
        {isLoggedIn ? (
          <>
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocICbozYQLKykVzkk_A8HOgunlHmtiGlRJlhxQTZDT1VZg=s96-c"
              alt="Profile"
              onClick={toggleDropdown}
              className="cursor-pointer w-8 h-8"
            />
            {dropdownVisible && (
              <div className="bg-white text-black shadow-md mt-2 py-2 absolute right-0 w-48 rounded">
                <a href="/settings" className="block px-4 py-2 hover:bg-gray-200">
                  Settings
                </a>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 text-black focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <GoogleLogin onSuccess={googleLogin} onError={onLoginError} />
        )}
      </div>
    </nav>
  );
}
