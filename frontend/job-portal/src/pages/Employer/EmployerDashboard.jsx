import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    Briefcase,
    Users,
    Building2,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Clock,
    FileText,
    MapPin,
    MoreHorizontal,
    UserCheck
} from "lucide-react";

import moment from "moment";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";


const Card = ({ className = "", children }) => {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
            {children}
        </div>
    );
};


const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue"
}) => {

    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-emerald-500 to-emerald-600",
        purple: "from-violet-500 to-violet-600",
        orange: "from-orange-500 to-orange-600",
    };

    return (
        <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {value}
                    </h2>

                    {trend && (
                        <div className="flex items-center gap-1 mt-3 text-sm">
                            <TrendingUp size={15} className="text-emerald-500" />
                            <span className="text-emerald-600 font-medium">
                                {trendValue}%
                            </span>
                            <span className="text-gray-400">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={25} />
                </div>

            </div>
        </Card>
    );
};


function EmployerDashboard() {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        Promise.resolve()
            .then(() => axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW))
            .then((response) => {
                if (active) setDashboardData(response.data);
            })
            .catch((error) => {
                console.error("Could not load employer dashboard:", error.response?.data || error.message);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => { active = false; };
    }, []);


    const counts = dashboardData?.counts || {};

    const jobs = dashboardData?.recentJobs || [];
    const applications = dashboardData?.recentApplications || [];


    return (

        <DashboardLayout activeMenu="employer-dashboard">

            {isLoading ? (

                <LoadingSpinner />

            ) : (

                <div className="max-w-7xl mx-auto space-y-8 pb-10">

                    {/* Header */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Employer Dashboard
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Welcome back! Here's your hiring overview.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/post-job")}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-md shadow-blue-100"
                        >
                            <Plus size={19} />
                            Post a New Job
                        </button>

                    </div>


                    {/* Statistics */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                        <StatCard
                            title="Active Jobs"
                            value={counts.totalActiveJobs || 0}
                            icon={Briefcase}
                            trend
                            trendValue={counts.trends?.activeJobs || 0}
                            color="blue"
                        />

                        <StatCard
                            title="Total Applicants"
                            value={counts.totalApplications || 0}
                            icon={Users}
                            trend
                            trendValue={counts.trends?.applications || 0}
                            color="purple"
                        />

                        <StatCard
                            title="Shortlisted"
                            value={counts.totalShortlisted || 0}
                            icon={UserCheck}
                            color="orange"
                        />

                        <StatCard
                            title="Total Hired"
                            value={counts.totalHired || 0}
                            icon={CheckCircle2}
                            color="green"
                        />

                    </div>


                    {/* Main Content */}

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Recent Jobs */}

                        <Card className="xl:col-span-2 overflow-hidden">

                            <div className="flex items-center justify-between p-6 border-b border-gray-100">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Recent Job Postings
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Manage your latest job openings
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/manage-jobs")}
                                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    View All
                                    <ArrowRight size={16} />
                                </button>

                            </div>


                            <div className="divide-y divide-gray-100">

                                {jobs.length > 0 ? (

                                    jobs.slice(0, 5).map((job, index) => (

                                        <div
                                            key={job._id || index}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="flex gap-4">

                                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                        <Briefcase className="text-blue-600" size={22} />
                                                    </div>

                                                    <div>

                                                        <h3 className="font-semibold text-gray-900">
                                                            {job.title}
                                                        </h3>

                                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">

                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {job.location || "Not specified"}
                                                            </span>

                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                {job.type || "Full-time"}
                                                            </span>

                                                        </div>

                                                        <p className="text-xs text-gray-400 mt-2">
                                                            Posted {job.createdAt
                                                                ? moment(job.createdAt).fromNow()
                                                                : "Recently"}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="flex flex-col items-end gap-3">

                                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                        job.status === "Active"
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                        {job.isClosed ? "Closed" : "Active"}
                                                    </span>

                                                    <button
                                                        onClick={() => navigate("/manage-jobs")}
                                                        className="text-gray-400 hover:text-blue-600"
                                                    >
                                                        <MoreHorizontal size={20} />
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    ))

                                ) : (

                                    <div className="py-14 text-center">

                                        <Briefcase
                                            size={40}
                                            className="mx-auto text-gray-300 mb-3"
                                        />

                                        <h3 className="font-semibold text-gray-700">
                                            No jobs posted yet
                                        </h3>

                                        <p className="text-sm text-gray-400 mt-1">
                                            Start hiring by posting your first job.
                                        </p>

                                        <button
                                            onClick={() => navigate("/post-job")}
                                            className="mt-4 text-blue-600 font-semibold text-sm"
                                        >
                                            Post a Job →
                                        </button>

                                    </div>

                                )}

                            </div>

                        </Card>


                        {/* Quick Actions */}

                        <div className="space-y-6">

                            <Card className="p-6">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Quick Actions
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your hiring activities
                                </p>


                                <div className="space-y-3 mt-6">

                                    <button
                                        onClick={() => navigate("/post-job")}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                                            <Plus className="text-white" size={21} />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                Post a Job
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Create a new opening
                                            </p>
                                        </div>

                                        <ArrowRight size={17} className="ml-auto text-blue-500" />
                                    </button>


                                    <button
                                        onClick={() => navigate("/manage-jobs")}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center">
                                            <FileText className="text-white" size={21} />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                Manage Jobs
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                View your job listings
                                            </p>
                                        </div>

                                        <ArrowRight size={17} className="ml-auto text-purple-500" />
                                    </button>


                                    <button
                                        onClick={() => navigate("/company-profile")}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-left"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
                                            <Building2 className="text-white" size={21} />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                Company Profile
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Update company details
                                            </p>
                                        </div>

                                        <ArrowRight size={17} className="ml-auto text-orange-500" />
                                    </button>

                                </div>

                            </Card>


                            {/* Hiring Summary */}

                            <Card className="p-6">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Hiring Summary
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Your recruitment activity
                                </p>


                                <div className="space-y-5 mt-6">

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">
                                                Active Jobs
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                {counts.totalActiveJobs || 0}
                                            </span>
                                        </div>

                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${Math.min((counts.totalActiveJobs || 0) * 10, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">
                                                Applications
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                {counts.totalApplications || 0}
                                            </span>
                                        </div>

                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-violet-500 rounded-full"
                                                style={{
                                                    width: `${Math.min((counts.totalApplications || 0) * 2, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600">
                                                Hired Candidates
                                            </span>

                                            <span className="font-semibold text-gray-900">
                                                {counts.totalHired || 0}
                                            </span>
                                        </div>

                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{
                                                    width: `${Math.min((counts.totalHired || 0) * 10, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>

                            </Card>

                        </div>

                    </div>


                    {/* Recent Applications */}

                    <Card className="overflow-hidden">

                        <div className="flex items-center justify-between p-6 border-b border-gray-100">

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Recent Applications
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Keep track of candidate applications
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/manage-jobs")}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-600"
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>

                        </div>


                        {applications.length > 0 ? (

                            <div className="overflow-x-auto">

                                <table className="w-full text-left">

                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                        <tr>
                                            <th className="px-6 py-4 font-semibold">
                                                Candidate
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Applied For
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Applied Date
                                            </th>

                                            <th className="px-6 py-4 font-semibold">
                                                Status
                                            </th>
                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {applications.slice(0, 5).map((application, index) => (

                                            <tr
                                                key={application._id || index}
                                                className="hover:bg-gray-50 transition-colors"
                                            >

                                                <td className="px-6 py-4">

                                                    <div className="font-semibold text-gray-900">
                                                        {application.applicant?.name ||
                                                         application.applicantName ||
                                                         "Candidate"}
                                                    </div>

                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {application.applicant?.email || ""}
                                                    </div>

                                                </td>


                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {application.job?.title ||
                                                     application.jobTitle ||
                                                     "Job Position"}
                                                </td>


                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {application.createdAt
                                                        ? moment(application.createdAt).format("DD MMM YYYY")
                                                        : "Recently"}
                                                </td>


                                                <td className="px-6 py-4">

                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                        {application.status || "Pending"}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="py-12 text-center">

                                <Users
                                    size={38}
                                    className="mx-auto text-gray-300 mb-3"
                                />

                                <h3 className="font-semibold text-gray-700">
                                    No applications yet
                                </h3>

                                <p className="text-sm text-gray-400 mt-1">
                                    Applications will appear here when candidates apply.
                                </p>

                            </div>

                        )}

                    </Card>

                </div>

            )}

        </DashboardLayout>

    );
}

export default EmployerDashboard;