"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function Nav() {
  const { isLoggedIn, login, logout } = useAuth();
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
      <div className="flex flex-row justify-end items-center mr-8 relative dropdown-container">
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
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Dashboard
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                  Account Settings
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
          <GoogleLogin onSuccess={login} onError={onLoginError} />
        )}
      </div>
    </nav>
  );
}
