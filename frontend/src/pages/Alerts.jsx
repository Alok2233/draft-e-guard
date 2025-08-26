import React from "react";
import { Link } from "react-router-dom";
import { FaBell, FaShieldAlt } from "react-icons/fa"; // react-icons instead of lucide
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Alerts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <FaBell className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Alerts & Notifications
                </h1>
              </div>
              <Link to="/dashboard">
                <button className="flex items-center space-x-2 border rounded-lg px-4 py-2 hover:bg-gray-100">
                  <FaShieldAlt className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
              </Link>
            </div>
            <p className="text-gray-600">
              Manage your notification preferences and view recent security alerts.
            </p>
          </div>

          {/* Placeholder Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Alerts to Display
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any security alerts at the moment. This is good news!
            </p>
            <Link to="/dashboard">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Alerts;
