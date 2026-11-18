const express=require("express");
const router=express.Router();
const {protect}=require("../middleware/authMiddleware");
const {SavedJob,usaveJob,getMysavedJobs}=require("../controllers/savedJobController")
router.post("/:jobId",protect,SavedJob);
router.delete("/:jobId",protect,usaveJob);
router.get("/my",protect,getMysavedJobs);
module.exports=router;