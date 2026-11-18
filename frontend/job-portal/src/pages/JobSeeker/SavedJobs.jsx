import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Bookmark,
    BriefcaseBusiness,
    ChevronRight,
    FolderHeart,
    RefreshCw,
    Search,
    ChevronDown,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import JobCard from "../../components/Cards/JobCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/useAuth";
function JobCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200/80" />
                    <div className="space-y-2">
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200/80" />
                        <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200/70" />
                    </div>
                </div>
                <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200/70" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <div className="h-6 w-20 animate-pulse rounded-md bg-slate-100" />
                <div className="h-6 w-24 animate-pulse rounded-md bg-slate-100" />
                <div className="h-6 w-28 animate-pulse rounded-md bg-slate-100" />
            </div>

            <div className="mt-5 space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-slate-200/70" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-200/70" />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200/80" />
                <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-200/80" />
            </div>
        </div>
    );
}

function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    // Load Saved Jobs
    useEffect(() => {
        let active = true;

        const loadSavedJobs = async () => {
            setLoading(true);
            setError("");
            try {
                const { data } = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
                if (active) {
                    setSavedJobs(data.filter((item) => item.job).map((item) => item.job));
                }
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                            "Unable to load your saved jobs. Please try again."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadSavedJobs();
        return () => {
            active = false;
        };
    }, [refresh]);

    // Remove Saved Job with Undo support
    const removeSavedJob = async (job) => {
        const previousJobs = [...savedJobs];
        setSavedJobs((current) => current.filter((saved) => saved._id !== job._id));

        try {
            await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(job._id));
            toast.success("Removed from saved jobs");
        } catch (requestError) {
            setSavedJobs(previousJobs);
            toast.error(requestError.response?.data?.message || "Could not remove saved job");
        }
    };

    // Dynamic job types for quick filter pills
    const jobTypes = useMemo(() => {
        const types = new Set(savedJobs.map((j) => j.type).filter(Boolean));
        return ["All", ...Array.from(types)];
    }, [savedJobs]);

    // Filtered list
    const filteredJobs = useMemo(() => {
        return savedJobs.filter((job) => {
            const matchesType = selectedType === "All" || job.type === selectedType;
            const query = searchQuery.trim().toLowerCase();
            if (!query) return matchesType;

            const company = (job.company?.companyName || job.company?.name || "").toLowerCase();
            const title = (job.title || "").toLowerCase();
            const location = (job.location || "").toLowerCase();

            return (
                matchesType &&
                (title.includes(query) || company.includes(query) || location.includes(query))
            );
        });
    }, [savedJobs, searchQuery, selectedType]);
    const {isAuthenticated,logout,user} =useAuth();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 antialiased">
            {/* Sticky Glass Navbar */}
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
                                    Find Jobs
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
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Link to="/find-jobs" className="transition hover:text-slate-700">
                        Home
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-700">Saved Jobs</span>
                </nav>

                {/* Header Banner */}
                <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">
                            <FolderHeart size={13} />
                            Shortlisted Roles
                        </div>
                        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Saved Jobs
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                            Review, compare, and apply to the roles you’ve bookmarked before they close.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <Link
                            to="/find-jobs"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            <Search size={16} />
                            Explore More Jobs
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </section>

                {/* Search & Filter Toolbar (Only shown when jobs exist) */}
                {!loading && !error && savedJobs.length > 0 && (
                    <section className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        {/* Search Input */}
                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                size={16}
                                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter by title, company, city..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-9 text-sm text-slate-800 placeholder-slate-400 shadow-2xs transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Type Filter Pills + Counter */}
                        <div className="flex flex-wrap items-center gap-2">
                            {jobTypes.length > 2 &&
                                jobTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                            selectedType === type
                                                ? "bg-slate-900 text-white shadow-2xs"
                                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}

                            <span className="ml-auto rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:ml-2">
                                {filteredJobs.length} of {savedJobs.length}{" "}
                                {savedJobs.length === 1 ? "job" : "jobs"}
                            </span>
                        </div>
                    </section>
                )}

                {/* Jobs Grid / States */}
                <section className="mt-6">
                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {[1, 2, 3, 4].map((n) => (
                                <JobCardSkeleton key={n} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-2xs">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                <RefreshCw size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                Couldn't load saved jobs
                            </h3>
                            <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">{error}</p>
                            <button
                                onClick={() => setRefresh((prev) => prev + 1)}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <RefreshCw size={15} />
                                Try Again
                            </button>
                        </div>
                    ) : savedJobs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Bookmark size={28} strokeWidth={1.75} />
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-slate-900">
                                No saved jobs yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Bookmark roles while browsing so you can compare compensation,
                                requirements, and apply when you're ready.
                            </p>
                            <Link
                                to="/find-jobs"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition hover:bg-blue-700"
                            >
                                <Search size={16} />
                                Browse Open Roles
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                            <p className="text-base font-semibold text-slate-800">
                                No saved jobs match "{searchQuery}"
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Try clearing your search or switching the job type filter.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedType("All");
                                }}
                                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isSaved={true}
                                    onToggleSave={removeSavedJob}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default SavedJobs;