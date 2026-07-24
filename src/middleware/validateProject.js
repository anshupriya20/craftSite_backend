const validateProjectInput = (req, res, next) => {
  const { projectName, pages } = req.body;

  if (projectName !== undefined && typeof projectName !== "string") {
    return res.status(400).json({ message: "projectName must be a string" });
  }

  if (pages !== undefined && !Array.isArray(pages)) {
    return res.status(400).json({ message: "pages must be an array" });
  }

  next();
};

module.exports = validateProjectInput;