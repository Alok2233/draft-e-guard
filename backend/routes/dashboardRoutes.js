const express = require("express");
const { getDashboard, getDetailedAnalytics } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getDashboard);
router.get("/analytics", authMiddleware, getDetailedAnalytics);

module.exports = router;