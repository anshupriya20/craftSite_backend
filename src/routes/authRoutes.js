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
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Kick off Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google redirects back here after consent
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  },
);

// Same pattern for GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  },
);

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
