const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
exports.registerUser = async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body);
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        error: "Please provide name, email, and password" 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    console.log("👤 Creating new user...");
    const newUser = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });
    
    const savedUser = await newUser.save();
    console.log("✅ User saved successfully:", savedUser._id);

    // IMPORTANT: Make sure to return a proper success response
    const response = {
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    };
    
    console.log("📤 Sending success response:", response);
    return res.status(201).json(response);
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Email already exists",
        success: false 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: errors.join(', '),
        success: false 
      });
    }
    
    // Generic server error
    return res.status(500).json({ 
      error: "Server error during registration",
      success: false 
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    console.log("🔐 Login request received:", { email: req.body.email });
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log("❌ Missing login credentials");
      return res.status(400).json({ 
        error: "Please provide email and password",
        success: false 
      });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ 
        error: "Invalid credentials",
        success: false 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ 
        error: "Invalid credentials",
        success: false 
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found");
      return res.status(500).json({ 
        error: "Server configuration error",
        success: false 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    const response = {
      success: true,
      message: "Login successful",
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    };
    
    console.log("✅ Login successful for:", email);
    return res.status(200).json(response);
    
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ 
      error: "Server error during login",
      success: false 
    });
  }
};