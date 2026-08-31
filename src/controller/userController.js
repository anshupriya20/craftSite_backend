const User = require("../models/userModel");

// GET all users — admin only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires");
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// GET one user by id — admin only
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// UPDATE a user's role — admin only
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    next(error);
  }
};

// DELETE a user — admin only
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// UPDATE a user's plan manually — admin only (e.g. comp a free upgrade, or force-downgrade)
const updateUserPlan = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const PLANS = require("../config/plans");

    if (!Object.keys(PLANS).includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { plan, planStartedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User plan updated", user });
  } catch (error) {
    next(error);
  }
};


// const updateUserPlan = async (req, res, next) => {
//   try {
//     const { plan } = req.body;
//     const PLANS = require("../config/plans");

//     if (!Object.keys(PLANS).includes(plan)) {
//       return res.status(400).json({
//         message: "Invalid plan",
//       });
//     }

//     const update = {
//       plan,
//       planStartedAt: new Date(),
//     };

//     // Admin-granted free/manual plan
//     if (plan === "free") {
//       update.planExpiresAt = null;
//       update.autoRenew = false;
//       update.cancelAtPeriodEnd = false;
//       update.paymentSubscriptionId = null;
//       update.subscriptionStatus = "inactive";
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       update,
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       message: "User plan updated",
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  updateUserPlan,
};