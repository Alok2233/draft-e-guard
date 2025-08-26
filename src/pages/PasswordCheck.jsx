import React, { useState } from "react";
import {Shield, Key, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
const PasswordCheck = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const navigate = useNavigate();

  const handlePasswordCheck = () => {
    if (!password.trim()) return;
    setIsChecking(true);

    // Simulate delay & navigate
    setTimeout(() => {
      navigate("/password-result", { state: { password } });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
 <AnimatedBackground/>
      {/* Hero Section */}

      <section className=" text-white py-50 px-6 text-center relative">
       
        <Key className="w-14 h-14 mx-auto mb-4 text-blue-300" />
        <h1 className="text-4xl font-bold mb-4">Password Security Check</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Check if your password has been exposed in data breaches and get
          instant strength analysis with recommendations.
        </p>

        {/* Input */}
        <div className="max-w-lg mx-auto flex items-center bg-white rounded-2xl shadow-lg overflow-hidden border">
          <Lock className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password to check"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-4 py-3 outline-none text-gray-700"
          />
          <button
            type="button"
            className="px-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
          <button
            onClick={handlePasswordCheck}
            disabled={isChecking || !password.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-all duration-300"
          >
            {isChecking ? "Checking..." : "Check Now"}
          </button>
        </div>
        {/* Privacy Notice Card inside Hero */}
    <div className="mt-8 max-w-xl mx-auto">
      <div className="p-6 flex items-start space-x-3 
          rounded-2xl border border-cyan-400 
          bg-white/10 backdrop-blur-lg shadow-lg">
        <Shield className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white mb-2">
            Your Privacy is Protected
          </h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            Passwords are never stored or transmitted. We use secure hashing to check 
            against breach databases without exposing your actual password.
          </p>
        </div>
      </div>
    </div>
    
      </section>

      
    </div>
    
  );
};

export default PasswordCheck;
