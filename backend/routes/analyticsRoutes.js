const express=require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const {getEmployerAnalytics, getPlatformAnalytics}=require("../controllers/analyticsController");
router.get("/platform",getPlatformAnalytics);
router.get("/overview",protect,getEmployerAnalytics);
module.exports=router;