import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser, handleApiError } from "../../utils/api";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUser(email, password);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);

      // Save user info if needed
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = handleApiError(err, "Login failed");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className="pl-10 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="pl-10 pr-12 w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-cyan-400 hover:bg-cyan-600 disabled:bg-gray-400 text-lg font-semibold text-white rounded-xl flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;