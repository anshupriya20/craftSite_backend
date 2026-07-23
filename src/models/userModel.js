const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // Signup
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    // SignIn
    password: {
      type: String,
      required: true,
      selected: false,
    },

    // ── Role-based access (admin vs user) ──
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Forgot password flow ──
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    // ── Account status (optional but common) ──

    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Editable profile details ──

    avatar: {
      type: String, //URL
    },

    bio: {
      type: String,
    },

    plan: {
      type: String,
      enum: ["free", "pro", "proYearly"],
      default: "free",
    },

    projectsCreatedCount: {
      type: Number,
      default: 0,
    },

    planStartedAt: {
      type: Date,
      default: null,
    },

    planExpiresAt: {
      type: Date,
      default: null, // null = never expires (free plan)
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true, // createdAt, updatedAt
  },
);

// Pre-save hook: runs automatically every time a user document is about to be saved
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or being changed
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
  // 1. Create a random token to send to the user (via email)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash it before storing in DB (never store raw tokens, same principle as passwords)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiry — 10 minutes from now
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  // 4. Return the UNHASHED token — this is what gets emailed to the user
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.export = User;
