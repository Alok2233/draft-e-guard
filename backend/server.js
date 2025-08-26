const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const breachRoutes = require("./routes/breachRoutes");
const passwordCheckRoutes = require("./routes/passwordCheck.js");

const app = express();
const PORT = process.env.PORT || 5000;

// FIXED: CORS configuration - removed extra slash
app.use(cors({
  origin: ["https://e-guard-ten.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes - FIXED: Consolidated breach routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/breach", breachRoutes);
app.use("/api/breach-analytics", breachRoutes); // This should be handled by breachRoutes
app.use("/api/password", passwordCheckRoutes);

// DB + Server Start
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
