const SavedJob=require("../models/SavedJob");
const Job=require("../models/Job");
exports.SavedJob=async(req,res)=>{
    try{
      if(req.user.role !== "jobseeker"){
        return res.status(403).json({message: "Only job seekers can save jobs"});
      }
      const job=await Job.findById(req.params.jobId);
      if(!job || job.isClosed){
        return res.status(404).json({message: "Job is unavailable"});
      }
      const exists=await SavedJob.findOne({job:req.params.jobId,jobseeker:req.user._id});
      if(exists){
        return res.status(400).json({message: "Job is already Saved"});
      }
      const saved=await SavedJob.create({job: req.params.jobId,jobseeker:req.user._id});
      return res.status(201).json(saved);
    }catch(err){
      if(err.code === 11000){
        return res.status(409).json({message: "Job is already saved"});
      }
      res.status(500).json({message: "Failed to save job",error: err.message});
    }
};
exports.usaveJob=async(req,res)=>{
    try{
      if(req.user.role !== "jobseeker"){
        return res.status(403).json({message: "Only job seekers can remove saved jobs"});
      }
      await SavedJob.findOneAndDelete({job: req.params.jobId,jobseeker: req.user._id});
      return res.json({message: "Job removed from saved list"});
    }catch(err){
        res.status(500).json({message: "Failed to remove saved job",error: err.message});
    }
};
exports.getMysavedJobs=async (req,res)=>{
    try{
        if(req.user.role !== "jobseeker"){
            return res.status(403).json({message: "Only job seekers can view saved jobs"});
        }
        const savedJobs=await SavedJob.find({jobseeker: req.user._id}).populate({path:"job",populate:{
            path:"company",
            select:"name companyName companyLogo",
        }});
        res.json(savedJobs);
    }catch(err){
        res.status(500).json({message: "Failed to fetch saved jobs",error: err.message});
    }
}
