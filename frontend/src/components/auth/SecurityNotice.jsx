import React from "react";
import { FaShieldAlt } from "react-icons/fa";

const SecurityNotice = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
      <div className="flex items-start space-x-2">
        <FaShieldAlt className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-800 font-medium mb-1">
            Your Security Matters
          </p>
          <p className="text-xs text-blue-700">
            We use industry-standard encryption to protect your data. Your
            passwords are never stored in plain text.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;
