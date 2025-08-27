import React from "react";

const AuthTabs = ({ tab, setTab }) => {
  return (
    <div className="grid grid-cols-2 mb-6 border rounded-xl overflow-hidden">
      <button
        className={`py-2 font-medium ${
          tab === "login" ? "bg-cyan-400 text-white" : "bg-gray-100"
        }`}
        onClick={() => setTab("login")}
      >
        Login
      </button>
      <button
        className={`py-2 font-medium ${
          tab === "signup" ? "bg-cyan-400 text-white" : "bg-gray-100"
        }`}
        onClick={() => setTab("signup")}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
