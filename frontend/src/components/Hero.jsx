import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaShieldAlt } from "react-icons/fa";
import AnimatedBackground from "./AnimatedBackground";
import { getBreachAnalytics, checkEmail, isValidEmail } from "../utils/api";
import toast from "react-hot-toast";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsChecking(true);

    try {
      // First check the breach API
      const breachData = await getBreachAnalytics(email);

      // Check if user is logged in
      const token = localStorage.getItem("token");
      
      if (token) {
        // User is logged in - save to database
        try {
          await checkEmail(email.trim());
        } catch (saveError) {
          console.log("Could not save to dashboard (user may not be logged in)");
          // Continue with public check even if save fails
        }
      }

      // Navigate to results page regardless of login status
      navigate(`/breach-result?email=${encodeURIComponent(email)}`);
      
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Failed to check email. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="relative pt-20 pb-16 px-4 overflow-hidden">
      <AnimatedBackground/>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <FaShieldAlt className="w-16 h-16 text-cyan-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Ensure Your Digital Identity
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Check if your email has been compromised in data breaches and take control of your security.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
          <div className="relative flex-1 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-700"
              disabled={isChecking}
              required
            />
          </div>
          <button
            onClick={handleEmailCheck}
            disabled={isChecking || !email.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
          >
            {isChecking ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Checking...
              </>
            ) : (
              <>
                <FaSearch className="w-5 h-5" />
                Check Email
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
