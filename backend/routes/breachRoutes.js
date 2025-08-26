const express = require("express");
const { 
  getBreachAnalytics, 
  checkAndLogEmail,
  logBreachCheck,
  getBreachHistory,
  getUserStats,
  deleteEmailCheck
} = require("../controllers/breachController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public route - just get breach data from API
router.get("/", getBreachAnalytics);

// Protected routes - require authentication
router.post("/check", authMiddleware, checkAndLogEmail); // New: complete check and log
router.post("/log", authMiddleware, logBreachCheck);     // Old: just log (kept for compatibility)
router.get("/history", authMiddleware, getBreachHistory);
router.get("/stats", authMiddleware, getUserStats);
router.delete("/check/:checkId", authMiddleware, deleteEmailCheck);

module.exports = router;