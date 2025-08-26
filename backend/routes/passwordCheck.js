// backend/routes/passwordCheck.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { sha3_512 } = require("js-sha3"); // ✅ Keccak-512

router.post("/check-password", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash with Keccak-512
    const fullHash = sha3_512(password);
    const prefix = fullHash.slice(0, 10);

    try {
      const response = await axios.get(
        `https://passwords.xposedornot.com/v1/pass/anon/${prefix}`,
        {
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                          "AppleWebKit/537.36 (KHTML, like Gecko) " +
                          "Chrome/114.0 Safari/537.36"
          },
        }
      );

      return res.json(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.json({
          notFound: true,
          message: "Password not found in breach database",
        });
      }

      console.error("API error:", err.response?.data || err.message);
      return res.status(500).json({ error: "Password check failed" });
    }
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
