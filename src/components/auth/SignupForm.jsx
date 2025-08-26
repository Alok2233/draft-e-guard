import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser, handleApiError } from "../../utils/api";
import toast from "react-hot-toast";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 Attempting to register user:", {
        name: signupData.name,
        email: signupData.email
      });

      const res = await registerUser(signupData.name, signupData.email, signupData.password);

      console.log("✅ Registration response:", res);

      // Check if the response indicates success
      if (res.data && (res.data.success !== false)) {
        const message =  "Account created successfully!";
        alert(message)
        
        // Clear form
        setSignupData({ 
          name: "", 
          email: "", 
          password: "", 
          confirmPassword: "" 
        });
        
        console.log("✅ Registration successful");
      } else {
        // Handle case where response doesn't indicate success
        const errorMessage = res.data?.error || "Registration failed";
        alert(errorMessage);
      }
      
    } catch (err) {
      console.error("❌ Signup error:", err);
      
      // Enhanced error handling
      let errorMessage = "Signup failed";
      
      if (err.response) {
        // Server responded with error status
        console.log("Error response:", err.response);
        errorMessage = err.response.data?.error || `Server error (${err.response.status})`;
      } else if (err.request) {
        // Request was made but no response received
        console.log("No response received:", err.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={signupData.name}
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          className="w-full h-12 px-4 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            className="pl-10 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            className="pl-10 pr-12 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
            required
            disabled={isLoading}
            minLength="6"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={signupData.confirmPassword}
            onChange={(e) =>
              setSignupData({ ...signupData, confirmPassword: e.target.value })
            }
            className="pl-10 pr-12 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold text-white rounded-xl flex items-center justify-center transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;