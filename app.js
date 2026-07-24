const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");

const errorHandler = require("./src/middleware/errorHandler");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
    })
);

app.get("/", (req, res) => {
    res.status(200).json({message: "CraftSite API is running"});
});

app.use("/api/auth", authRoutes);
app.use("/app/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);

// ==================404 HANDLER - for any route that doesn't match above =====================
app.use((req,res) => {
    res.status(404).json({message: "Route not found"});
});

// ===============CENTRALIZED ERROR HANDLER-MUST BE LAST============================
app.use(errorHandler);

module.exports = app;