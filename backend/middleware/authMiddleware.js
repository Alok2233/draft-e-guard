const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Headers:", req.headers.authorization);
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid authorization header");
      return res.status(401).json({ 
        error: "No token, authorization denied",
        hint: "Include 'Bearer <token>' in Authorization header"
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.log("❌ No token found after Bearer");
      return res.status(401).json({ error: "No token provided" });
    }

    console.log("🔐 Token received:", token.substring(0, 20) + "...");

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);
    
    // Validate that decoded token has required fields
    if (!decoded.id) {
      console.log("❌ Token missing user ID");
      return res.status(401).json({ error: "Invalid token structure" });
    }

    req.user = { id: decoded.id };
    console.log("✅ User set in request:", req.user);
    
    next();
    
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    
    res.status(401).json({ 
      error: "Token verification failed", 
      message: err.message 
    });
  }
};

module.exports = authMiddleware;