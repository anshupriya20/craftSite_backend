const express = require("express");
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

router.post("/",  protect, validateProjectInput, createProject);
router.get("/projects", getMyProjects);
router.get("/project/:id", getProjectById);
router.put("/update-project/:id",  protect, validateProjectInput, updateProject);
router.delete("/delete/:id", deleteProject);
router.post("/:id/publish", publishProject);
router.get("/:id/preview", previewProject);

module.exports = router;
