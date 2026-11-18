const fs=require('fs');
const path=require('path');
const User=require('../models/User');
const {cloudinary, uploadToCloudinary} = require('../config/cloudinary');

exports.updateProfile=async(req,res)=>{
    try{
        const {
            name,
            avatar,
            companyName,
            companyDescription,
            companyLogo,
            resume,
            title,
            bio,
            location,
            phone,
            portfolio,
            skills,
            experience,
            education,
            availability,
        } = req.body;
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if (typeof name === 'string' && name.trim()) user.name = name.trim();
        if (typeof avatar === 'string') user.avatar = avatar;
        if (user.role === 'jobseeker') {
            if (typeof resume === 'string') user.resume = resume;
            if (typeof title === 'string') user.title = title;
            if (typeof bio === 'string') user.bio = bio;
            if (typeof location === 'string') user.location = location;
            if (typeof phone === 'string') user.phone = phone;
            if (typeof portfolio === 'string') user.portfolio = portfolio;
            if (Array.isArray(skills)) user.skills = skills.map((skill) => String(skill).trim()).filter(Boolean);
            if (typeof experience === 'string') user.experience = experience;
            if (typeof education === 'string') user.education = education;
            if (typeof availability === 'string') user.availability = availability;
        }
        if(user.role === 'employer'){
            if (typeof companyName === 'string') user.companyName = companyName;
            if (typeof companyDescription === 'string') user.companyDescription = companyDescription;
            if (typeof companyLogo === 'string') user.companyLogo = companyLogo;
        }
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            title: user.title || "",
            bio: user.bio || "",
            location: user.location || "",
            phone: user.phone || "",
            portfolio: user.portfolio || "",
            skills: user.skills || [],
            experience: user.experience || "",
            education: user.education || "",
            availability: user.availability || "",
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || "",
        });
    }catch(err){
        console.error(err);
        res.status(500).json({message: err.message});
    }
};
exports.deleteResume=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if(user.role !== "jobseeker"){
            return res.status(403).json({message: 'Only jobseekers can delete resume'});
        }
        if (user.resumePublicId) {
            await cloudinary.uploader.destroy(user.resumePublicId, {
                resource_type: user.resumeResourceType || "image",
            });
        } else {
            const fileName = path.basename(user.resume || "");
            const filePath=path.join(__dirname,'../uploads',fileName);
            if(fileName && fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }
        user.resume='';
        user.resumePublicId=undefined;
        user.resumeResourceType=undefined;
        await user.save();
        res.json({message: 'Resume deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: err.message});
    }
};
exports.uploadResume=async(req,res)=>{
    if(req.user.role !== "jobseeker"){
        return res.status(403).json({message: 'Only jobseekers can upload a resume'});
    }
    if(!req.file || req.file.mimetype !== "application/pdf"){
        return res.status(400).json({message: 'Please upload a PDF resume'});
    }

    let uploaded;
    try{
        uploaded = await uploadToCloudinary(req.file, "job-portal/resumes");
    }catch(err){
        console.error("Resume upload failed:", err);
        return res.status(502).json({message: 'Could not upload resume'});
    }

    let user;
    try{
        user=await User.findById(req.user.id);
        if(!user){
            await cloudinary.uploader.destroy(uploaded.public_id, {
                resource_type: uploaded.resource_type,
            });
            return res.status(404).json({message: 'User not found'});
        }
        user.resume=uploaded.secure_url;
        user.resumePublicId=uploaded.public_id;
        user.resumeResourceType=uploaded.resource_type;
        await user.save();
        return res.status(200).json({resumeUrl: user.resume});
    }catch(err){
        try{
            await cloudinary.uploader.destroy(uploaded.public_id, {
                resource_type: uploaded.resource_type,
            });
        }catch(cleanupError){
            console.error("Could not clean up failed resume upload:", cleanupError);
        }
        console.error("Resume upload failed:", err);
        return res.status(500).json({message: 'Could not save resume'});
    }
};
exports.getPublicProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select('name avatar role title bio location phone portfolio skills experience education availability companyName companyDescription companyLogo');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({message: err.message});
    }
};