const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  updateUserPlan,
} = require("../controllers/userController");

const router = express.Router();

// Every route here is admin-only
router.use(protect, restrictTo("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.put("/:id/plan", updateUserPlan);
router.delete("/:id", deleteUser);

module.exports = router;