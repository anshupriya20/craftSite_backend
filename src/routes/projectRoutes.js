const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const validateProjectInput = require("../middleware/validateProject");

const {
  previewProject,
  publishProject,
  deleteProject,
  updateProject,
  getProjectById,
  getMyProjects,
  createProject,
} = require("../controller/projectController");

const router = express.Router();

// ── Public route — no login required (shareable preview link) ──
router.get("/:id/preview", previewProject);

// ── Protected routes — must be logged in ──
router.post("/", protect, validateProjectInput, createProject);
router.get("/", protect, getMyProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, validateProjectInput, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/:id/publish", protect, publishProject);

module.exports = router;