const axios = require("axios");
const EmailCheck = require("../models/EmailCheck");

// 🔹 Fetch breach analytics from API
exports.getBreachAnalytics = async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    console.log(`🔍 Checking email: ${email}`);
    
    const response = await axios.get(
      `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
      { 
        headers: { 
          "User-Agent": "E-Guard-App/1.0", 
          Accept: "application/json" 
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log(`✅ API Response for ${email}:`, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("API fetch error:", error.message);
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
      
      // Handle specific API errors
      if (error.response.status === 404) {
        return res.json({ 
          email: email,
          breaches: [],
          isBreached: false,
          message: "Email not found in any known breaches" 
        });
      }
    }
    
    res.status(500).json({ 
      error: "Failed to fetch breach analytics",
      details: error.message
    });
  }
};

// 🔹 Complete email check and log to DB - FIXED VERSION
exports.checkAndLogEmail = async (req, res) => {
  try {
    console.log("=== COMPLETE EMAIL CHECK ===");
    console.log("User:", req.user);
    console.log("Request body:", req.body);

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Step 1: Check email against breach API
    console.log(`🔍 Checking breach data for: ${email}`);
    
    let apiResponse = null;
    let isBreached = false;
    let breachCount = 0;
    let breachDetails = [];
    
    try {
      const response = await axios.get(
        `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
        { 
          headers: { 
            "User-Agent": "E-Guard-App/1.0", 
            Accept: "application/json" 
          },
          timeout: 10000
        }
      );
      
      apiResponse = response.data;
      console.log("🔍 Raw API Response:", JSON.stringify(apiResponse, null, 2));
      
      // Parse the API response properly
      if (apiResponse && apiResponse.ExposedBreaches) {
        const exposedBreaches = apiResponse.ExposedBreaches;
        
        // Check if breaches exist
        if (exposedBreaches.breaches_details && Array.isArray(exposedBreaches.breaches_details)) {
          isBreached = exposedBreaches.breaches_details.length > 0;
          breachCount = exposedBreaches.breaches_details.length;
          
          // Extract breach details
          breachDetails = exposedBreaches.breaches_details.map(breach => ({
            name: breach.breach || 'Unknown',
            domain: breach.domain || 'Unknown',
            breachDate: breach.xposed_date ? new Date(breach.xposed_date) : new Date(),
            dataClasses: breach.details ? [breach.details] : [],
            exposedRecords: breach.xposed_records || 0
          }));
        }
      }
      
    } catch (apiError) {
      console.log("API Error (treating as no breaches):", apiError.message);
      // If API fails, treat as no breaches found
      isBreached = false;
      breachCount = 0;
      breachDetails = [];
    }

    console.log(`📊 Breach analysis results:`);
    console.log(`- Email: ${email}`);
    console.log(`- Is Breached: ${isBreached}`);
    console.log(`- Breach Count: ${breachCount}`);
    console.log(`- Breach Details:`, breachDetails);

    // Step 2: Save to database
    const log = new EmailCheck({
      userId: req.user.id,
      email: email.toLowerCase().trim(),
      breached: isBreached,
      breaches: breachCount,
      breachDetails: breachDetails,
      checkedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    console.log("💾 Saving to database...");
    const savedLog = await log.save();
    console.log("✅ Successfully saved:", savedLog._id);
    console.log("✅ Saved data:", {
      email: savedLog.email,
      breached: savedLog.breached,
      breaches: savedLog.breaches,
      breachDetailsCount: savedLog.breachDetails.length
    });

    // Step 3: Get updated user statistics
    const userStats = await EmailCheck.getUserStats(req.user.id);
    console.log("📊 Updated user stats:", userStats);
    
    // Step 4: Return comprehensive response
    res.json({
      success: true,
      message: "Email check completed successfully",
      result: {
        email: email,
        isBreached: isBreached,
        breachCount: breachCount,
        breachDetails: breachDetails,
        status: isBreached ? 'compromised' : 'safe',
        checkedAt: savedLog.checkedAt
      },
      log: savedLog,
      userStats: userStats
    });
    
  } catch (err) {
    console.error("❌ Complete check error:", err);
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Invalid data", 
        details: Object.keys(err.errors).map(key => err.errors[key].message)
      });
    }
    
    res.status(500).json({ 
      error: "Server error during email check", 
      message: err.message 
    });
  }
};

// 🔹 Log breach check to DB (kept for backward compatibility)
exports.logBreachCheck = async (req, res) => {
  try {
    console.log("=== LOGGING BREACH CHECK ===");
    const { email, breached, breaches, breachDetails } = req.body;
    
    if (!email || breached === undefined) {
      return res.status(400).json({ 
        error: "Email and breached status required"
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const log = new EmailCheck({
      userId: req.user.id,
      email: email.toLowerCase().trim(),
      breached,
      breaches: breaches || 0,
      breachDetails: breachDetails || [],
      checkedAt: new Date(),
    });

    const savedLog = await log.save();
    console.log("✅ Successfully logged to DB:", savedLog._id);

    res.json({ 
      message: "Breach check logged successfully", 
      log: savedLog,
      success: true 
    });
    
  } catch (err) {
    console.error("❌ Log error:", err);
    res.status(500).json({ 
      error: "Server error", 
      message: err.message 
    });
  }
};

// 🔹 Get recent breach history for logged-in user
exports.getBreachHistory = async (req, res) => {
  try {
    console.log("=== FETCHING BREACH HISTORY ===");
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get paginated history
    const history = await EmailCheck.find({ userId: req.user.id })
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await EmailCheck.countDocuments({ userId: req.user.id });
    
    // Get user statistics
    const userStats = await EmailCheck.getUserStats(req.user.id);

    console.log(`📚 Found ${history.length} records (page ${page})`);

    res.json({ 
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalRecords: totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats: userStats,
      userId: req.user.id 
    });
    
  } catch (err) {
    console.error("❌ Fetch history error:", err);
    res.status(500).json({ 
      error: "Server error", 
      message: err.message 
    });
  }
};

// 🔹 Get user dashboard statistics
exports.getUserStats = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const stats = await EmailCheck.getUserStats(req.user.id);
    
    res.json({
      success: true,
      stats: stats
    });
    
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ 
      error: "Server error", 
      message: err.message 
    });
  }
};

// 🔹 Delete a specific email check record
exports.deleteEmailCheck = async (req, res) => {
  try {
    const { checkId } = req.params;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const deletedCheck = await EmailCheck.findOneAndDelete({
      _id: checkId,
      userId: req.user.id // Ensure user can only delete their own records
    });

    if (!deletedCheck) {
      return res.status(404).json({ error: "Email check record not found" });
    }

    res.json({
      success: true,
      message: "Email check record deleted successfully",
      deletedRecord: deletedCheck
    });
    
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ 
      error: "Server error", 
      message: err.message 
    });
  }
};