const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

const getTrend = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }

    return Math.round(((current - previous) / previous) * 100);
};

exports.getPlatformAnalytics = async (req, res) => {
    try {
        const [jobseekers, employers, openJobs, successfulHires] = await Promise.all([
            User.countDocuments({ role: "jobseeker" }),
            User.countDocuments({ role: "employer" }),
            Job.countDocuments({ isClosed: false }),
            Application.countDocuments({ status: "Accepted" }),
        ]);
        return res.json({ jobseekers, employers, openJobs, successfulHires });
    } catch (err) {
        console.error("Platform analytics error:", err);
        return res.status(500).json({ message: "Failed to fetch platform analytics" });
    }
};

exports.getEmployerAnalytics = async (req, res) => {
    try {

        if (req.user.role !== "employer") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const companyId = req.user._id;

        const now = new Date();

        const last7Days = new Date(now);
        last7Days.setDate(now.getDate() - 7);

        const prev7Days = new Date(now);
        prev7Days.setDate(now.getDate() - 14);


        // 1. Job IDs

        const jobs = await Job.find({
            company: companyId
        })
            .select("_id")
            .lean();

        const jobIds = jobs.map(job => job._id);


        // 2. Dashboard Counts

        const totalActiveJobs = await Job.countDocuments({
            company: companyId,
            isClosed: false
        });

        const totalApplications = await Application.countDocuments({
            job: { $in: jobIds }
        });

        const totalHired = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted"
        });

        const totalShortlisted = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Shortlisted"
        });


        // 3. Active Jobs Trend

        const activeJobsLast7 = await Job.countDocuments({
            company: companyId,
            createdAt: {
                $gte: last7Days,
                $lte: now
            }
        });

        const activeJobsPrev7 = await Job.countDocuments({
            company: companyId,
            createdAt: {
                $gte: prev7Days,
                $lt: last7Days
            }
        });

        const activeJobTrend = getTrend(
            activeJobsLast7,
            activeJobsPrev7
        );


        // 4. Applications Trend

        const applicationsLast7 = await Application.countDocuments({
            job: { $in: jobIds },
            createdAt: {
                $gte: last7Days,
                $lte: now
            }
        });

        const applicationsPrev7 = await Application.countDocuments({
            job: { $in: jobIds },
            createdAt: {
                $gte: prev7Days,
                $lt: last7Days
            }
        });

        const applicationTrend = getTrend(
            applicationsLast7,
            applicationsPrev7
        );


        // 5. Hired Trend

        const hiredLast7 = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted",
            createdAt: {
                $gte: last7Days,
                $lte: now
            }
        });

        const hiredPrev7 = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted",
            createdAt: {
                $gte: prev7Days,
                $lt: last7Days
            }
        });

        const hiredTrend = getTrend(
            hiredLast7,
            hiredPrev7
        );


        // 6. Recent Jobs

        const recentJobs = await Job.find({
            company: companyId
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title location type createdAt isClosed")
            .lean();


        // 7. Recent Applications

        const recentApplications = await Application.find({
            job: { $in: jobIds }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("applicant", "name email avatar")
            .populate("job", "title")
            .lean();


        // 8. Final Response

        res.status(200).json({

            counts: {
                totalActiveJobs,
                totalApplications,
                totalShortlisted,
                totalHired,

                trends: {
                    activeJobs: activeJobTrend,
                    applications: applicationTrend,
                    totalHired: hiredTrend
                }
            },

            recentJobs,
            recentApplications

        });

    } catch (err) {

        console.error("Employer Analytics Error:", err);

        res.status(500).json({
            message: "Failed to fetch analytics",
            error: err.message
        });

    }
};