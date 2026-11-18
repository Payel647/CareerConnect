const express = require("express");
const {register,login,getMe} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadToCloudinary } = require("../config/cloudinary");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/upload-image", upload.single("image"), async (req, res) => {
    if (!req.file || !req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "Please upload an image file" });
    }
    try {
        const uploaded = await uploadToCloudinary(req.file, "job-portal/images");
        return res.status(200).json({ imageUrl: uploaded.secure_url });
    } catch (error) {
        console.error("Image upload failed:", error);
        return res.status(502).json({ error: "Image upload failed" });
    }
});
module.exports = router;