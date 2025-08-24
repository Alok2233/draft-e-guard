// controllers/dashboardController.js - DEBUG VERSION
const User = require("../models/User");
const EmailCheck = require("../models/EmailCheck");

exports.getDashboard = async (req, res) => {
  try {
    console.log("=== DEBUG DASHBOARD ===");
    console.log("1. User from request:", req.user);
    
    if (!req.user || !req.user.id) {
      console.log("❌ No user ID found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log("2. Finding user by ID:", req.user.id);
    
    // Get user details (without password)
    const user = await User.findById(req.user.id).select("-password");
    console.log("3. User found:", user ? "YES" : "NO");
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("4. Finding email checks...");
    
    // Get all checks using simple find
    const allChecks = await EmailCheck.find({ userId: req.user.id });
    console.log("5. Email checks found:", allChecks.length);

    const totalChecks = allChecks.length;
    const breachedCount = allChecks.filter(c => c.breached).length;
    const safeCount = totalChecks - breachedCount;

    console.log("6. Basic stats calculated:", { totalChecks, breachedCount, safeCount });

    // Get last 3 checks using simple sort and limit
    const recentLogs = await EmailCheck.find({ userId: req.user.id })
      .sort({ checkedAt: -1 })
      .limit(3);

    console.log("7. Recent logs found:", recentLogs.length);

    const stats = {
      totalChecks,
      breachedCount, 
      safeCount,
      uniqueEmailCount: [...new Set(allChecks.map(c => c.email))].length
    };

    console.log("8. Final stats:", stats);

    const response = {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      stats,
      recentLogs,
      securityScore: {
        score: 75,
        rating: 'Good',
        recommendations: ['Keep up the good work!']
      }
    };

    console.log("9. Sending response...");
    res.json(response);
    
  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    res.status(500).json({ 
      error: "Server error", 
      message: err.message,
      name: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Simplified analytics
exports.getDetailedAnalytics = async (req, res) => {
  try {
    res.json({
      success: true,
      analytics: {
        last7Days: { totalChecks: 0, breachedCount: 0, safeCount: 0 },
        last30Days: { totalChecks: 0, breachedCount: 0, safeCount: 0 },
        last90Days: { totalChecks: 0, breachedCount: 0, safeCount: 0 }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};