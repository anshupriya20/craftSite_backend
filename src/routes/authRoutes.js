const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserDetails,
  getCurrentUser,
  logoutUser,
} = require("../controller/authController");


const router = express.Router();

// ── Public routes — no login required ──
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ── Protected routes — must be logged in ──
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);
router.put("/change-password", protect, changePassword);
router.put("/update-details", protect, updateUserDetails);

module.exports = router;
