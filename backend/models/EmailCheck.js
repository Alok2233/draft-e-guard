const mongoose = require("mongoose");

const emailCheckSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // Add index for better query performance
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true, // Normalize email addresses
    trim: true
  },
  breaches: { 
    type: Number, 
    default: 0 
  },
  breached: { 
    type: Boolean, 
    default: false 
  },
  breachDetails: [{
    name: String,
    domain: String,
    breachDate: Date,
    dataClasses: [String]
  }], // Store detailed breach information
  checkedAt: { 
    type: Date, 
    default: Date.now,
    index: true // Add index for sorting
  },
  ipAddress: String, // Optional: track where check was made from
  userAgent: String // Optional: track user agent
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Add compound index for efficient queries
emailCheckSchema.index({ userId: 1, checkedAt: -1 });
emailCheckSchema.index({ userId: 1, email: 1 });

// Add method to get formatted date
emailCheckSchema.methods.getFormattedDate = function() {
  return this.checkedAt.toLocaleString();
};

// Static method to get user statistics - FIXED VERSION
emailCheckSchema.statics.getUserStats = async function(userId) {
  try {
    // Convert string to ObjectId properly
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const stats = await this.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          breachedCount: { $sum: { $cond: ["$breached", 1, 0] } },
          safeCount: { $sum: { $cond: ["$breached", 0, 1] } },
          totalBreaches: { $sum: "$breaches" },
          lastCheck: { $max: "$checkedAt" },
          uniqueEmails: { $addToSet: "$email" }
        }
      },
      {
        $project: {
          _id: 0,
          totalChecks: 1,
          breachedCount: 1,
          safeCount: 1,
          totalBreaches: 1,
          lastCheck: 1,
          uniqueEmailCount: { $size: "$uniqueEmails" }
        }
      }
    ]);
    
    return stats[0] || {
      totalChecks: 0,
      breachedCount: 0,
      safeCount: 0,
      totalBreaches: 0,
      lastCheck: null,
      uniqueEmailCount: 0
    };
  } catch (error) {
    console.error("Error in getUserStats:", error);
    // Return default stats if aggregation fails
    return {
      totalChecks: 0,
      breachedCount: 0,
      safeCount: 0,
      totalBreaches: 0,
      lastCheck: null,
      uniqueEmailCount: 0
    };
  }
};

module.exports = mongoose.model("EmailCheck", emailCheckSchema);