import { Link } from "react-router-dom";
import React from "react";
import { FaHome, FaKey, FaInfoCircle, FaSignInAlt, FaBalanceScale, FaShieldAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
             
               <FaShieldAlt className="w-8 h-8 text-cyan-400" />
               <span >E-Guard</span>
            </div>
            <p className="text-gray-400 mb-5 max-w-md leading-relaxed">
              Safeguard your digital identity with{" "}
              <span className="text-blue-400 font-medium">
                real-time breach detection
              </span>{" "}
              and advanced security monitoring. Check if your email or password
              has ever been compromised.
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()}{" "}
              <span className="text-gray-300 font-medium">E-Guard</span>. All
              rights reserved. We never store your sensitive data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaHome /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/password-check"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaKey /> Password Check
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaInfoCircle /> About
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaSignInAlt /> Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaShieldAlt /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaBalanceScale /> Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@e-guard.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  <FaEnvelope /> Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>
            🔒 Built with{" "}
            <span className="text-emerald-400">security</span> &{" "}
            <span className="text-blue-400">privacy</span> in mind. Your data
            stays <span className="font-medium text-gray-300">safe & private</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
