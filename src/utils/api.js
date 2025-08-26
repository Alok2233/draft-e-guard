
import axios from "axios";

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ;


const API = axios.create({ 
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000 // 30 second timeout
});

// Add request interceptor to include auth token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Add response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// ============= AUTHENTICATION =============

// Login user
export const loginUser = (email, password) => 
  API.post("/auth/login", { email, password });

// Register user
export const registerUser = (name, email, password) => 
  API.post("/auth/register", { name, email, password });

// Google OAuth
export const googleAuth = (tokenId) => 
  API.post("/auth/google", { tokenId });

// ============= EMAIL BREACH CHECKING =============

// Complete email check (checks API + logs to DB)
export const checkEmail = (email) => API.post("/breach/check", { email });

// Get breach data from API only (no logging) - for public use
export const getBreachData = (email) => API.get(`/breach?email=${encodeURIComponent(email)}`);

// Direct breach analytics call (for public breach checking)
export const getBreachAnalytics = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/breach-analytics?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breach analytics:', error);
    throw error;
  }
};

// Log existing breach check data to DB
export const logBreachCheck = (data) => API.post("/breach/log", data);

// ============= HISTORY & ANALYTICS =============

// Get paginated breach history
export const getHistory = (page = 1, limit = 10) => 
  API.get(`/breach/history?page=${page}&limit=${limit}`);

// Get user statistics
export const getUserStats = () => API.get("/breach/stats");

// Delete specific email check
export const deleteEmailCheck = (checkId) => API.delete(`/breach/check/${checkId}`);

// ============= DASHBOARD =============

// Get dashboard data
export const getDashboard = () => API.get("/dashboard");

// Get detailed analytics
export const getDetailedAnalytics = () => API.get("/dashboard/analytics");

// ============= UTILITY FUNCTIONS =============

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
};

// Format breach status
export const formatBreachStatus = (breached, breachCount = 0) => {
  if (!breached) return { status: "Safe", color: "green", icon: "✅" };
  return { 
    status: `Compromised (${breachCount} breach${breachCount !== 1 ? 'es' : ''})`, 
    color: "red", 
    icon: "⚠️" 
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============= ERROR HANDLING =============

// Handle API errors consistently
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

// ============= CONFIGURATION =============

// Export API base URL for direct fetch calls
export const getApiBaseUrl = () => API_BASE_URL;

// Export configured axios instance
export default API;