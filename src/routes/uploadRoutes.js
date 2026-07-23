const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const { uploadFile } = require("../controller/uploadController");

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

module.exports = router;