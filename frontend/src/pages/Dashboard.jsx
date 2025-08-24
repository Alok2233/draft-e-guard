import React, { useEffect, useState } from "react";
import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  Key,
  Bell,
  Trash2,
  TrendingUp,
  Activity,
  Eye,
  RefreshCw
} from "lucide-react";
import {FaShieldAlt} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getDashboard, getDetailedAnalytics, deleteEmailCheck, handleApiError, formatDate } from "../utils/api";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [securityScore, setSecurityScore] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching dashboard data...");
      const res = await getDashboard();
      
      console.log("Dashboard data received:", res.data);
      
      setUser(res.data.user);
      setStats(res.data.stats);
      setRecentLogs(res.data.recentLogs || []);
      setSecurityScore(res.data.securityScore);
      
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      const errorMessage = handleApiError(err, "Failed to load dashboard data");
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed analytics
  const fetchAnalytics = async () => {
    try {
      const res = await getDetailedAnalytics();
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // Delete email check record
  const handleDeleteCheck = async (checkId) => {
    if (!confirm("Are you sure you want to delete this email check record?")) {
      return;
    }
    
    try {
      await deleteEmailCheck(checkId);
      alert("Email check record deleted successfully");
      await fetchDashboard();
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to delete record");
      alert(`Error: ${errorMessage}`);
    }
  };

  // Toggle analytics view
  const toggleAnalytics = () => {
    if (!showAnalytics) {
      fetchAnalytics();
    }
    setShowAnalytics(!showAnalytics);
  };

  // Helper functions
  const getStatusIcon = (breached) =>
    !breached ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-600" />
    );

  const getStatusColor = (breached) =>
    !breached
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  const getSecurityScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          < FaShieldAlt className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-red-600">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}! 
              </h1>
              <p className="text-gray-600">
                Monitor and protect your email security from potential data breaches.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchDashboard}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={toggleAnalytics}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </button>
            </div>
          </div>

          {/* Security Score */}
          {securityScore && (
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Security Score
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold px-4 py-2 rounded-full ${getSecurityScoreColor(securityScore.score)}`}>
                    {securityScore.score}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{securityScore.rating}</p>
                    <p className="text-sm text-gray-600">Overall security rating</p>
                  </div>
                </div>
                <div className="text-right max-w-md">
                  <p className="text-sm text-gray-600 mb-2">Recommendations:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {securityScore.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Checks</p>
                <p className="text-3xl font-bold">{stats.totalChecks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Compromised</p>
                <p className="text-3xl font-bold text-red-600">{stats.breachedCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Safe Emails</p>
                <p className="text-3xl font-bold text-green-600">{stats.safeCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Unique Emails</p>
                <p className="text-3xl font-bold text-purple-600">{stats.uniqueEmailCount || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {showAnalytics && analytics && (
            <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Detailed Analytics
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(analytics).map(([period, data]) => (
                  <div key={period} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {period.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>Checks: <span className="font-medium">{data.totalChecks}</span></p>
                      <p>Breached: <span className="font-medium text-red-600">{data.breachedCount}</span></p>
                      <p>Safe: <span className="font-medium text-green-600">{data.safeCount}</span></p>
                      <p>Unique: <span className="font-medium">{data.uniqueEmailCount}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Email Checks */}
          <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" /> Recent Email Checks
              </h2>
              <Link 
                to="/"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Check New Email
              </Link>
            </div>

            <div className="space-y-4">
              {recentLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No email checks yet</p>
                  <p className="text-sm text-gray-400 mb-4">Start protecting your digital identity by checking your email addresses on the home page</p>
                  <Link to="/">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Check Your First Email
                    </button>
                  </Link>
                </div>
              ) : (
                recentLogs.map((emailData, index) => (
                  <div
                    key={emailData._id || index}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(emailData.breached)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{emailData.email}</p>
                        <p className="text-sm text-gray-500">
                          Checked: {formatDate(emailData.checkedAt)}
                        </p>
                        {emailData.breached && (
                          <p className="text-sm text-red-600 font-medium">
                            ⚠️ Found in {emailData.breaches || 0} data breach{(emailData.breaches || 0) !== 1 ? 'es' : ''}
                          </p>
                        )}
                        {!emailData.breached && (
                          <p className="text-sm text-green-600 font-medium">
                            ✅ No breaches found
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          emailData.breached
                        )}`}
                      >
                        {emailData.breached ? "Compromised" : "Safe"}
                      </span>
                      <button
                        onClick={() => handleDeleteCheck(emailData._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete this check"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {recentLogs.length > 0 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/history" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View Complete History
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/">
                <button className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                  <Mail className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Check New Email</span>
                </button>
              </Link>

              <Link to="/password-check">
                <button className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                  <Key className="w-6 h-6 mb-2 text-green-600" />
                  <span className="text-sm font-medium">Check Password</span>
                </button>
              </Link>

              <Link to="/alerts">
                <button className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200">
                  <Bell className="w-6 h-6 mb-2 text-yellow-600" />
                  <span className="text-sm font-medium">Manage Alerts</span>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-red-50 hover:border-red-300 text-red-600 transition-all duration-200"
              >
                <LogOut className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;