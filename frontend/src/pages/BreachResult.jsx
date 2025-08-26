import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getBreachAnalytics } from "../utils/api";

const BreachResult = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(true);
  const [breaches, setBreaches] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchBreachAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await getBreachAnalytics(email);

        const breachList = data?.ExposedBreaches?.breaches_details || [];
        setBreaches(breachList);

        if (breachList.length > 0) {
          toast.error(
            `⚠️ Your email was found in ${breachList.length} breach${
              breachList.length > 1 ? "es" : ""
            }.`
          );
        } else {
          toast.success("✅ Good news! No breaches found for this email.");
        }
      } catch (error) {
        console.error("Error fetching breach analytics:", error);
        toast.error("⚠️ Failed to fetch breach details. Try again later.");
      }
      setIsLoading(false);
    };

    fetchBreachAnalytics();
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-md text-center p-8">
            <FaShieldAlt className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2">Scanning Email...</h2>
            <p className="text-gray-600">
              Checking {email} against our breach database
            </p>
          </div>
        )}

        {/* Safe Result */}
        {!isLoading && breaches.length === 0 && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-xl shadow-lg text-center p-8">
            <FaCheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Good News!
            </h1>
            <p className="text-xl text-green-700 mb-6">
              No breaches found for <strong>{email}</strong>
            </p>
          </div>
        )}

        {/* Breach Found */}
        {!isLoading && breaches.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-red-100 to-red-50 border border-red-200 rounded-xl shadow-lg p-6 text-center">
            <FaExclamationTriangle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-red-800 mb-4">Oh no!</h1>
            <p className="text-xl text-red-700">
              Your email <strong>{email}</strong> was found in{" "}
              <strong>{breaches.length}</strong> breach
              {breaches.length > 1 ? "es" : ""}.
            </p>
            <p className="text-red-600 mb-6">
              Your personal information may have been exposed. We recommend
              taking immediate action.
            </p>
            <div className="space-y-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                onClick={() => setShowPopup(true)}
              >
                Secure Your Account
              </button>
            </div>
            <button
              className="mt-6 px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
          </div>
        )}

        {/* Timeline Details */}
        {showDetails && breaches.length > 0 && (
          <div className="relative mt-14">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-red-200 to-transparent transform -translate-x-1/2" />
            {breaches.map((b, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={b.breach}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative mb-12 w-full flex ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Timeline Dot */}
                  <span className="absolute left-1/2 transform -translate-x-1/2 top-6 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg" />

                  {/* Card */}
                  <div
                    className={`w-[46%] p-6 rounded-xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1 ${
                      isLeft ? "mr-auto" : "ml-auto"
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={b.logo}
                        alt={b.breach}
                        className="w-14 h-14 rounded-full border mr-4 shadow"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          {b.breach}{" "}
                          <FaLock className="text-red-500 text-sm" />
                        </h3>
                        <span className="text-sm text-gray-500">
                          {b.xposed_date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {b.details}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>
                        <strong>Records:</strong>{" "}
                        {b.xposed_records.toLocaleString()}
                      </p>
                      <p>
                        <strong>Domain:</strong> {b.domain}
                      </p>
                      <p>
                        <strong>Industry:</strong> {b.industry}
                      </p>
                      <p>
                        <a
                          href={b.references}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Reference ↗
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Secure Account Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-[#000000de] z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg backdrop-blur-md bg-cyan-400/30 border border-cyan-300 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center">
                🔒 Secure Your Account
              </h2>
              <ul className="space-y-3 text-left list-disc pl-6">
                <li>Change your password immediately.</li>
                <li>Enable two-factor authentication (2FA).</li>
                <li>Use a strong & unique password manager.</li>
                <li>Monitor suspicious logins and activity.</li>
                <li>Be cautious of phishing emails & links.</li>
              </ul>

              <div className="mt-6 flex justify-center">
                <button
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg shadow-lg"
                  onClick={() => setShowPopup(false)}
                >
                  Got it 👍
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default BreachResult;
