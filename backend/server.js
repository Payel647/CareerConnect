require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes=require("./routes/applicationRoutes");
const saveJobRoutes=require("./routes/savedJobRoutes");
const analyticsRoutes=require("./routes/analyticsRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware to handle Cors
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//connect to database
connectDB();
// middleware
app.use(express.json());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/save-jobs",saveJobRoutes);
app.use("/api/analytics", analyticsRoutes);
//serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});