import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import AuthTabs from "../components/auth/AuthTabs";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import SecurityNotice from "../components/auth/SecurityNotice";
import AnimatedBackground from "../components/AnimatedBackground";
const Auth = () => {
  const [tab, setTab] = useState("login");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FaShieldAlt className="w-12 h-12 text-cyan-400 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">E-Guard</h1>
            </div>
            <p className="text-gray-600">
              Ensure your digital identity with advanced breach monitoring
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Google OAuth */}
            <GoogleAuthButton />

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Tabs */}
            <AuthTabs tab={tab} setTab={setTab} />

            {/* Forms */}
            {tab === "login" ? <LoginForm /> : <SignupForm />}

            {/* Security Notice */}
            <SecurityNotice />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
