const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const jobFields = [
    "title",
    "description",
    "requirements",
    "location",
    "category",
    "type",
    "salaryMin",
    "salaryMax",
];

const getJobPayload = (body) =>
    Object.fromEntries(
        jobFields
            .filter((field) => body[field] !== undefined)
            .map((field) => [field, body[field]])
    );

exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can create jobs" });
        }

        const job = await Job.create({
            ...getJobPayload(req.body),
            company: req.user._id,
        });
        return res.status(201).json(job);
    } catch (err) {
        console.error("Create job failed:", err);
        return res.status(400).json({ message: err.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const { keyword, location, category, type, minSalary, maxSalary, company } = req.query;
        const query = { isClosed: false };

        if (keyword) {
            const search = escapeRegex(keyword);
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        if (location) query.location = { $regex: escapeRegex(location), $options: "i" };
        if (category) query.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
        if (type) query.type = { $regex: `^${escapeRegex(type)}$`, $options: "i" };

        if (company) {
            const search = escapeRegex(company);
            const matchingCompanies = await User.find({
                role: "employer",
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { companyName: { $regex: search, $options: "i" } },
                ],
            }).select("_id");
            query.company = { $in: matchingCompanies.map((user) => user._id) };
        }

        if (minSalary !== undefined || maxSalary !== undefined) {
            const minimum = minSalary === undefined || minSalary === "" ? undefined : Number(minSalary);
            const maximum = maxSalary === undefined || maxSalary === "" ? undefined : Number(maxSalary);
            if ((minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0))
                || (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0))) {
                return res.status(400).json({ message: "Salary filters must be non-negative numbers" });
            }
            if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
                return res.status(400).json({ message: "Minimum salary cannot exceed maximum salary" });
            }
            query.$and = [];
            if (minimum !== undefined) query.$and.push({ salaryMax: { $gte: minimum } });
            if (maximum !== undefined) query.$and.push({ salaryMin: { $lte: maximum } });
            if (query.$and.length === 0) delete query.$and;
        }

        const jobs = await Job.find(query)
            .populate("company", "name companyName companyLogo")
            .sort({ createdAt: -1 });
        return res.json(jobs);
    } catch (err) {
        console.error("Fetch jobs failed:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.getJobsEmployer = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can manage jobs" });
        }

        const jobs = await Job.find({ company: req.user._id })
            .populate("company", "name companyName companyLogo")
            .sort({ createdAt: -1 })
            .lean();
        const counts = await Application.aggregate([
            { $match: { job: { $in: jobs.map((job) => job._id) } } },
            { $group: { _id: "$job", count: { $sum: 1 } } },
        ]);
        const countByJob = new Map(counts.map(({ _id, count }) => [String(_id), count]));

        return res.json(
            jobs.map((job) => ({
                ...job,
                applicationCount: countByJob.get(String(job._id)) || 0,
            }))
        );
    } catch (err) {
        console.error("Fetch employer jobs failed:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "name companyName companyLogo");
        if (!job) return res.status(404).json({ message: "Job not found" });
        return res.json(job);
    } catch (err) {
        console.error("Fetch job failed:", err);
        return res.status(400).json({ message: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can update jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }

        Object.assign(job, getJobPayload(req.body));
        await job.save();
        return res.json(job);
    } catch (err) {
        console.error("Update job failed:", err);
        return res.status(400).json({ message: err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can delete jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }

        await job.deleteOne();
        await Application.deleteMany({ job: job._id });
        await SavedJob.deleteMany({ job: job._id });
        return res.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error("Delete job failed:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.toggleCloseJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can close jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }

        job.isClosed = !job.isClosed;
        await job.save();
        return res.json({ message: job.isClosed ? "Job closed" : "Job reopened", job });
    } catch (err) {
        console.error("Toggle job status failed:", err);
        return res.status(500).json({ message: err.message });
    }
};
