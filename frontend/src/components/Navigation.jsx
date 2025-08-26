import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // check token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/password-check", label: "Password Check" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-700 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-xl text-white"
          >
            <FaShieldAlt className="w-8 h-8 text-cyan-400" />
            <span>E-Guard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                    : "text-gray-300 hover:text-cyan-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dashboard Icon */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleDashboardClick}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              <FaUserCircle className="w-7 h-7" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-gray-900">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block font-medium py-2 transition-colors duration-200 ${
                    isActive(link.path)
                      ? "text-cyan-400"
                      : "text-gray-300 hover:text-cyan-400"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Dashboard (mobile) */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleDashboardClick();
                }}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
