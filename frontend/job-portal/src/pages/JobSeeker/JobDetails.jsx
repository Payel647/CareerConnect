import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    DollarSign,
    MapPin,
    Share2,
    LogOut,
    UserCircle,
    ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
function JobDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] antialiased">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-200/80" />
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200/80" />
                        <div className="h-5 w-24 animate-pulse rounded-md bg-slate-200/80" />
                    </div>
                </div>
            </header>

            {/* Main Grid Skeleton */}
            <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px]">
                {/* Left Column Skeleton */}
                <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    {/* Hero Section */}
                    <div className="border-b border-slate-100 p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-slate-200/80" />
                                <div className="space-y-2.5">
                                    <div className="h-5 w-24 animate-pulse rounded-md bg-slate-200/80" />
                                    <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200/80 sm:w-80" />
                                    <div className="h-4 w-40 animate-pulse rounded-md bg-slate-200/80" />
                                </div>
                            </div>
                            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200/80" />
                        </div>

                        {/* Metadata Strip Skeleton */}
                        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-200/80" />
                                    <div className="space-y-1.5">
                                        <div className="h-2.5 w-14 animate-pulse rounded bg-slate-200/80" />
                                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200/80" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description & Requirements Skeleton */}
                    <div className="space-y-8 p-6 sm:p-8">
                        <div className="space-y-3">
                            <div className="h-4 w-36 animate-pulse rounded bg-slate-200/80" />
                            <div className="space-y-2.5 pt-1">
                                <div className="h-3.5 w-full animate-pulse rounded bg-slate-200/70" />
                                <div className="h-3.5 w-full animate-pulse rounded bg-slate-200/70" />
                                <div className="h-3.5 w-11/12 animate-pulse rounded bg-slate-200/70" />
                                <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200/70" />
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-8">
                            <div className="h-4 w-56 animate-pulse rounded bg-slate-200/80" />
                            <div className="space-y-3 pt-1">
                                {[1, 2, 3, 4].map((line) => (
                                    <div key={line} className="flex items-center gap-3">
                                        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-slate-200/80" />
                                        <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200/70" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Sticky Sidebar Skeleton */}
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                        <div className="h-6 w-44 animate-pulse rounded-md bg-slate-200/80" />
                        <div className="mt-2.5 space-y-1.5">
                            <div className="h-3.5 w-full animate-pulse rounded bg-slate-200/70" />
                            <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-200/70" />
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200/80" />
                            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200/70" />
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

function JobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated,logout} = useAuth();
    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    useEffect(() => {
        let active = true;
        const loadJob = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
                if (active) setJob(data);
                if (active && isAuthenticated && user?.role === "jobseeker") {
                    const [savedResponse, appsResponse] = await Promise.all([
                        axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS),
                        axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS),
                    ]);
                    if (active) {
                        setSaved(savedResponse.data.some((item) => item.job?._id === jobId));
                        setApplied(appsResponse.data.some((item) => item.job?._id === jobId));
                    }
                }
            } catch (error) {
                if (active) toast.error(error.response?.data?.message || "Could not load this job");
            } finally {
                if (active) setLoading(false);
            }
        };
        loadJob();
        return () => { active = false; };
    }, [jobId, isAuthenticated, user?.role]);

    const apply = async () => {
        if (!isAuthenticated || user?.role !== "jobseeker") {
            navigate("/login");
            return;
        }
        if (!user.resume) {
            toast.error("Upload your resume before applying");
            navigate("/profile");
            return;
        }
        setSubmitting(true);
        try {
            await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
            setApplied(true);
            toast.success("Application submitted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not submit application");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSave = async () => {
        if (!isAuthenticated || user?.role !== "jobseeker") {
            navigate("/login");
            return;
        }
        try {
            if (saved) {
                await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
                setSaved(false);
                toast.success("Removed from saved jobs");
            } else {
                await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
                setSaved(true);
                toast.success("Job saved");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update saved jobs");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Job link copied to clipboard");
    };

    if (loading) return <JobDetailsSkeleton />;

    if (!job) {
        return (
            <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <BriefcaseBusiness size={26} />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-slate-900">Job not found</h1>
                <p className="mt-2 text-sm text-slate-500">This listing may have been removed or the link is invalid.</p>
                <Link
                    to="/find-jobs"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <ArrowLeft size={16} />
                    Browse all jobs
                </Link>
            </main>
        );
    }

    const companyName = job.company?.companyName || job.company?.name || "Company";

    const requirementItems = job.requirements
        ? job.requirements
              .split(/\r?\n/)
              .map((line) => line.replace(/^[-•*]\s*/, "").trim())
              .filter(Boolean)
        : [];

    const hasSalary = Boolean(job.salaryMin || job.salaryMax);
    const formattedSalary = hasSalary
        ? `${job.salaryMin ? `$${Number(job.salaryMin).toLocaleString()}` : ""}${
              job.salaryMin && job.salaryMax ? " – " : ""
          }${job.salaryMax ? `$${Number(job.salaryMax).toLocaleString()}` : ""}`
        : "Not disclosed";

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                            <BriefcaseBusiness size={20} className="text-white" />
                        </div>
                        JobPortal
                    </Link>

                    <nav className="flex items-center gap-3 text-sm font-medium sm:gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/saved-jobs" className="hidden items-center gap-2 text-slate-600 transition hover:text-blue-700 sm:flex">
                                    <Bookmark size={17} />
                                    Saved Jobs
                                </Link>
                                <Link to="/my-applications" className="hidden text-slate-600 transition hover:text-blue-700 sm:block">
                                    My Applications
                                </Link>

                                <div className="jobseeker-profile-menu relative">
                                    <button
                                        onClick={() => setProfileMenuOpen((open) => !open)}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {user?.name?.charAt(0)?.toUpperCase() || "J"}
                                            </div>
                                        )}
                                        <span className="hidden text-left sm:block">
                                            <span className="block text-sm font-semibold">{user?.name || "Job Seeker"}</span>
                                            <span className="block text-[11px] text-slate-500">Candidate</span>
                                        </span>
                                        <ChevronDown size={16} className={`transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {profileMenuOpen && (
                                        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200">
                                            <div className="border-b border-slate-200 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {user?.avatar ? (
                                                        <img src={user.avatar} alt="Avatar" className="h-11 w-11 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                                                            {user?.name?.charAt(0)?.toUpperCase() || "J"}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-800">{user?.name || "Job Seeker"}</p>
                                                        <p className="truncate text-xs text-slate-500">{user?.email || "No email provided"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setProfileMenuOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <UserCircle size={17} />
                                                    My Profile
                                                </Link>
                                            </div>

                                            <div className="border-t border-slate-200 p-2">
                                                <button
                                                    onClick={() => {
                                                        setProfileMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <LogOut size={17} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 transition hover:text-blue-700">Login</Link>
                                <Link to="/signup" className="rounded-xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700">Sign Up</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px]">
                {/* Left Column: Job Specification */}
                <article className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    {/* Header Section */}
                    <div className="border-b border-slate-100 p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                {job.company?.companyLogo ? (
                                    <img
                                        src={job.company.companyLogo}
                                        alt={`${companyName} logo`}
                                        className="h-14 w-14 shrink-0 rounded-xl border border-slate-200/80 bg-white object-contain p-1.5 shadow-2xs"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                                        <Building2 size={24} />
                                    </div>
                                )}

                                <div>
                                    <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                        {job.title}
                                    </h1>
                                    <p className="mt-1 text-base font-medium text-slate-600">{companyName}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleShare}
                                title="Copy job link"
                                className="inline-flex w-fit items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <Share2 size={14} />
                                Share
                            </button>
                        </div>

                        {/* Metadata Strip */}
                        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-2xs ring-1 ring-slate-200/70">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Location</p>
                                    <p className="text-sm font-semibold text-slate-800">{job.location || "Remote / Flexible"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-2xs ring-1 ring-slate-200/70">
                                    <BriefcaseBusiness size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Job Type</p>
                                    <p className="text-sm font-semibold text-slate-800">{job.type || "Full-time"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-2xs ring-1 ring-slate-200/70">
                                    <DollarSign size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Compensation</p>
                                    <p className="text-sm font-semibold text-slate-800">{formattedSalary}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Requirements Body */}
                    <div className="space-y-8 p-6 sm:p-8">
                        <section>
                            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">About the Role</h2>
                            <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                                {job.description}
                            </p>
                        </section>

                        {requirementItems.length > 0 && (
                            <section className="border-t border-slate-100 pt-8">
                                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                                    Requirements & Qualifications
                                </h2>
                                <ul className="mt-4 space-y-3">
                                    {requirementItems.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[15px] leading-6 text-slate-600">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </article>

                {/* Right Column: Sticky Action Panel */}
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                        <h2 className="text-lg font-bold text-slate-900">Interested in this role?</h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                            Submit your profile directly to {companyName}'s hiring team.
                        </p>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={apply}
                                disabled={applied || submitting || job.isClosed}
                                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    applied
                                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : job.isClosed
                                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                        : "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99]"
                                }`}
                            >
                                {applied && <CheckCircle2 size={17} />}
                                {job.isClosed
                                    ? "Applications Closed"
                                    : applied
                                    ? "Application Submitted"
                                    : submitting
                                    ? "Submitting..."
                                    : "Apply Now"}
                            </button>

                            <button
                                onClick={toggleSave}
                                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                                    saved
                                        ? "border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-50"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                                {saved ? "Saved to List" : "Save for Later"}
                            </button>
                        </div>

                        {isAuthenticated && user?.role === "jobseeker" && !user?.resume && (
                            <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs leading-5 text-amber-900">
                                <span className="font-semibold">Resume required:</span> Upload your CV before applying.{" "}
                                <Link to="/profile" className="font-semibold underline hover:text-amber-950">
                                    Update profile →
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default JobDetails;