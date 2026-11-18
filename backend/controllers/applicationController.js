const Application = require("../models/Application");
const Job = require("../models/Job");

exports.applyToJob = async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only job seekers can apply" });
        }
        if (!req.user.resume) {
            return res.status(400).json({ message: "Upload a resume before applying" });
        }

        const job = await Job.findById(req.params.jobId);
        if (!job || job.isClosed) {
            return res.status(404).json({ message: "Job is unavailable" });
        }
        const existing = await Application.findOne({
            job: job._id,
            applicant: req.user._id,
        });
        if (existing) {
            return res.status(409).json({ message: "Already applied to this job" });
        }

        const application = await Application.create({
            job: job._id,
            applicant: req.user._id,
            resume: req.user.resume,
        });
        return res.status(201).json(application);
    } catch (err) {
        console.error("Apply to job failed:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "Already applied to this job" });
        }
        return res.status(400).json({ message: err.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only job seekers can view applications" });
        }
        const apps = await Application.find({ applicant: req.user._id })
            .populate({
                path: "job",
                select: "title company location type isClosed",
                populate: { path: "company", select: "name companyName companyLogo" },
            })
            .sort({ createdAt: -1 });
        return res.json(apps);
    } catch (err) {
        console.error("Fetch applications failed:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.getApplicantsForJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can view applicants" });
        }
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to view applicants" });
        }

        const applications = await Application.find({ job: job._id })
            .populate("job", "title location category type")
            .populate("applicant", "name email avatar resume title bio location phone portfolio skills experience education availability")
            .sort({ createdAt: -1 });
        return res.json(applications);
    } catch (err) {
        console.error("Fetch applicants failed:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id)
            .populate("job", "title company")
            .populate("applicant", "name email avatar resume");
        if (!app) return res.status(404).json({ message: "Application not found" });

        const isApplicant = String(app.applicant._id) === String(req.user._id);
        const isEmployer = String(app.job.company) === String(req.user._id);
        if (!isApplicant && !isEmployer) {
            return res.status(403).json({ message: "Not authorized to view this application" });
        }
        return res.json(app);
    } catch (err) {
        console.error("Fetch application failed:", err);
        return res.status(400).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can update application status" });
        }
        const allowedStatuses = ["Applied", "In Review", "Shortlisted", "Rejected", "Accepted"];
        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({ message: "Invalid application status" });
        }

        const app = await Application.findById(req.params.id).populate("job", "company");
        if (!app) return res.status(404).json({ message: "Application not found" });
        if (String(app.job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this application" });
        }
        app.status = req.body.status;
        await app.save();
        return res.json({ message: "Application status updated", application: app });
    } catch (err) {
        console.error("Update application status failed:", err);
        return res.status(400).json({ message: err.message });
    }
};