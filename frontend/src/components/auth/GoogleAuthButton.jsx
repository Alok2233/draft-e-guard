import React from "react";
import { FaGoogle } from "react-icons/fa";

const GoogleAuthButton = () => {
  const handleGoogleAuth = async () => {
    // TODO: Replace with real Google OAuth
    alert("Google Authentication Available Soon!!!")
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full h-12 mb-6 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center rounded-xl"
    >
      <FaGoogle className="mr-2" /> Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;
