const Project = require("../models/projectModel");
const PLANS = require("../config/plans");

// ============================CREATE=============================
const PLAN_LIMITS = {
  free: 3,
  pro: Infinity,
};

const createProject = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    user = await checkAndDowngradeIfExpired(user);

    const limit = PLANS[user.plan]?.projectLimit ?? PLANS.free.projectLimit;

    // Check against LIFETIME count, not current live count
    if (user.projectsCreatedCount >= limit) {
      return res.status(403).json({
        message:
          "Free plan limit reached. Please upgrade to create more projects.",
        limitReached: true,
      });
    }

    const { projectName } = req.body;
    const project = await Project.create({
      projectName: projectName || "Untitled Project",
      owner: req.user.id,
      pages: [{ id: "home", name: "Home", canvasItems: [] }],
    });

    // Increment lifetime counter — this NEVER decreases, even if project is deleted
    user.projectsCreatedCount += 1;
    await user.save();

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    next(error);
  }
};

// ========================GET ALL (belonging to logged-in user only)====================
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({
      updatedAt: -1,
    });
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

// =======================================GET ONE========================================
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ownership check — a user should only access their own project
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this project" });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

// ==============UPDATE (this is what your builder's autosave will call constantly)===============
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    const { projectName, pages, activePageId } = req.body;

    if (projectName !== undefined) project.projectName = projectName;
    if (pages !== undefined) project.pages = pages;
    if (activePageId !== undefined) project.activePageId = activePageId;

    await project.save();

    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    next(error);
  }
};

// ===============================DELETE=============================
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

// ================PUBLISH — snapshot current pages into publishedPages===============
const publishProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to publish this project" });
    }

    project.publishedPages = project.pages; // snapshot draft → live
    project.isPublished = true;
    project.publishedAt = new Date();

    await project.save();

    res.status(200).json({ message: "Project published", project });
  } catch (error) {
    next(error);
  }
};

// =============================PREVIEW PROJECT==============================
const previewProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).select(
      "projectName pages",
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Deliberately NOT checking ownership — preview links are meant to be shareable
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  publishProject,
};
