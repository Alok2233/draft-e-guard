import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Clock,
  Database,
  TrendingUp
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { getHistory, deleteEmailCheck, handleApiError, formatDate } from "../utils/api";
import toast from "react-hot-toast";

const History = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch history data
  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getHistory(page, 20); // 20 items per page
      
      setHistory(response.data.history);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      
    } catch (err) {
      console.error("History fetch error:", err);
      const errorMessage = handleApiError(err, "Failed to load history");
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [navigate]);

  // Filter and sort history
  const filteredHistory = history
    .filter(item => {
      // Search filter
      if (searchTerm && !item.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Status filter
      if (statusFilter === "breached" && !item.breached) return false;
      if (statusFilter === "safe" && item.breached) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.checkedAt) - new Date(a.checkedAt);
        case "oldest":
          return new Date(a.checkedAt) - new Date(b.checkedAt);
        case "email":
          return a.email.localeCompare(b.email);
        case "breaches":
          return (b.breaches || 0) - (a.breaches || 0);
        default:
          return 0;
      }
    });

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchHistory(newPage);
    }
  };

  // Handle delete email check
  const handleDelete = async (checkId) => {
    try {
      await deleteEmailCheck(checkId);
      toast.success("Email check deleted successfully");
      fetchHistory(currentPage);
      setShowDeleteConfirm(false);
      setEmailToDelete(null);
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to delete record");
      toast.error(errorMessage);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;
    
    if (!confirm(`Delete ${selectedEmails.length} selected records?`)) return;
    
    try {
      await Promise.all(selectedEmails.map(id => deleteEmailCheck(id)));
      toast.success(`${selectedEmails.length} records deleted successfully`);
      setSelectedEmails([]);
      fetchHistory(currentPage);
    } catch (err) {
      toast.error("Failed to delete some records");
    }
  };

  // Export history to CSV
  const exportToCSV = () => {
    const csvData = filteredHistory.map(item => ({
      Email: item.email,
      Status: item.breached ? 'Compromised' : 'Safe',
      Breaches: item.breaches || 0,
      'Checked At': formatDate(item.checkedAt)
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Breaches,Checked At\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `email-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("History exported to CSV");
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

  const getBadgeColor = (breachCount) => {
    if (breachCount === 0) return "bg-green-100 text-green-800";
    if (breachCount <= 2) return "bg-yellow-100 text-yellow-800";
    if (breachCount <= 5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  if (loading && history.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-96">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-gray-600">Loading history...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Check History</h1>
                <p className="text-gray-600">Complete record of all your email security checks</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => fetchHistory(currentPage)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            {stats && (
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Checks</p>
                      <p className="text-2xl font-bold">{stats.totalChecks}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Compromised</p>
                      <p className="text-2xl font-bold text-red-600">{stats.breachedCount}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Safe</p>
                      <p className="text-2xl font-bold text-green-600">{stats.safeCount}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Unique Emails</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.uniqueEmailCount}</p>
                    </div>
                    <Mail className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Email</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by email..."
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Emails</option>
                    <option value="safe">Safe Only</option>
                    <option value="breached">Compromised Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="email">Email A-Z</option>
                    <option value="breaches">Most Breaches</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkDelete}
                      disabled={selectedEmails.length === 0}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedEmails.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {error ? (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchHistory(currentPage)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm || statusFilter !== "all" ? "No matching records found" : "No email checks yet"}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Start by checking your first email on the home page"
                  }
                </p>
                <Link to="/">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Check Email Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails(filteredHistory.map(item => item._id));
                            } else {
                              setSelectedEmails([]);
                            }
                          }}
                          checked={selectedEmails.length === filteredHistory.length && filteredHistory.length > 0}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Breaches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Checked At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedEmails.includes(item._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmails([...selectedEmails, item._id]);
                              } else {
                                setSelectedEmails(selectedEmails.filter(id => id !== item._id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{item.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(item.breached)}
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.breached)}`}>
                              {item.breached ? "Compromised" : "Safe"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${getBadgeColor(item.breaches || 0)}`}>
                            {item.breaches || 0} breach{(item.breaches || 0) !== 1 ? 'es' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(item.checkedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {item.breached && item.breachDetails && item.breachDetails.length > 0 && (
                              <button
                                onClick={() => {/* Could show breach details modal */}}
                                className="text-blue-600 hover:text-blue-900"
                                title="View breach details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEmailToDelete(item);
                                setShowDeleteConfirm(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 20, pagination.totalRecords)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.totalRecords}</span> results
                    </p>
                  </div>
                  
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && emailToDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete the check record for{' '}
                  <strong>{emailToDelete.email}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setEmailToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(emailToDelete._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default History;