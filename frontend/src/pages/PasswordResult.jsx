import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {FaShieldAlt} from 'react-icons/fa'

const PasswordResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkResult, setCheckResult] = useState(null);

  // password strength logic
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 20;
    if (/\d/.test(pwd)) strength += 15;
    if (/[^a-zA-Z\d]/.test(pwd)) strength += 15;
    return Math.min(strength, 100);
  };

  const getStrengthLabel = (strength) => {
    if (strength < 40) return { label: "Weak", color: "text-red-600" };
    if (strength < 70) return { label: "Fair", color: "text-yellow-600" };
    if (strength < 90) return { label: "Good", color: "text-blue-600" };
    return { label: "Strong", color: "text-green-600" };
  };

  const generateSuggestions = (pwd) => {
    const suggestions = [];
    if (pwd.length < 8) suggestions.push("Use at least 8 characters");
    if (pwd.length < 12) suggestions.push("Consider using 12+ characters");
    if (!/[a-z]/.test(pwd)) suggestions.push("Include lowercase letters");
    if (!/[A-Z]/.test(pwd)) suggestions.push("Include uppercase letters");
    if (!/\d/.test(pwd)) suggestions.push("Include numbers");
    if (!/[^a-zA-Z\d]/.test(pwd)) suggestions.push("Include special characters");
    if (pwd.toLowerCase().includes("password"))
      suggestions.push("Avoid using 'password'");
    return suggestions;
  };

  useEffect(() => {
    if (!state?.password) {
      navigate("/password-check");
      return;
    }

    // simulate API check
    setTimeout(() => {
      const strength = checkPasswordStrength(state.password);
      const suggestions = generateSuggestions(state.password);
      const isCompromised = Math.random() > 0.7;
      const breachCount = isCompromised
        ? Math.floor(Math.random() * 50000) + 1000
        : 0;
      setCheckResult({ isCompromised, breachCount, strength, suggestions });
      setLoading(false);
    }, 2000);
  }, [state, navigate]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md text-center p-8">
                  <FaShieldAlt className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-2xl font-semibold mb-2">Scanning Email...</h2>
                  <p className="text-gray-600">
                    Checking your password against our breach database
                  </p>
                </div>
    );
  }

  const strengthInfo = getStrengthLabel(checkResult.strength);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 py-16 px-6 max-w-5xl mx-auto space-y-10">
        {/* Status Card */}
        <div
          className={`rounded-2xl p-8 text-center shadow-lg ${
            checkResult.isCompromised
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          {checkResult.isCompromised ? (
            <>
              <AlertTriangle className="w-14 h-14 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                Password Compromised
              </h2>
              <p className="text-red-600">
                Found in <strong>{checkResult.breachCount.toLocaleString()}</strong>{" "}
                known breaches.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Password Not Found in Breaches
              </h2>
              <p className="text-green-600">
                This password does not appear in our breach database.
              </p>
            </>
          )}
        </div>

        {/* Strength Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border">
          <h3 className="text-xl font-semibold mb-6">Password Strength</h3>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Strength Score</span>
              <span className={`font-semibold ${strengthInfo.color}`}>
                {checkResult.strength}% - {strengthInfo.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="h-3 rounded-full bg-blue-600"
                style={{ width: `${checkResult.strength}%` }}
              />
            </div>
          </div>
          {checkResult.suggestions.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              {checkResult.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PasswordResult;
