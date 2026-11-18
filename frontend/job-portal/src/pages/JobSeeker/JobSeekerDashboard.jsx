import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BriefcaseBusiness,
    Search,
    UserCircle,
    MapPin,
    Building2,
    SlidersHorizontal,
    Bookmark,
    ArrowRight,
    Sparkles,
    X,
    RotateCcw,
    ChevronDown,
    LogOut,
} from "lucide-react";

import toast from "react-hot-toast";
import JobCard from "../../components/Cards/JobCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";


const initialFilters = {
    keyword: "",
    location: "",
    company: "",
    category: "",
    type: ""
};

const SummaryCard = ({ title, value, icon: Icon, accent }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
    </div>
);

function JobSeekerDashboard() {

   const {isAuthenticated,logout,user} =useAuth();
    const navigate = useNavigate();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const [filters, setFilters] = useState(initialFilters);
    const [submittedFilters, setSubmittedFilters] = useState(initialFilters);

    const [jobs, setJobs] = useState([]);
    const [savedIds, setSavedIds] = useState(new Set());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Load Jobs
    useEffect(() => {

        let active = true;

        const loadJobs = async () => {

            setLoading(true);
            setError("");

            try {

                const params = Object.fromEntries(
                    Object.entries(submittedFilters).filter(
                        ([, value]) => value.trim()
                    )
                );

                const response = await axiosInstance.get(
                    API_PATHS.JOBS.GET_ALL_JOBS,
                    { params }
                );

                if (active) {
                    setJobs(response.data);
                }

            } catch (requestError) {

                if (active) {
                    setError(
                        requestError.response?.data?.message ||
                        "Could not load jobs. Please try again."
                    );
                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };

        loadJobs();

        return () => {
            active = false;
        };

    }, [submittedFilters]);


    // Load Saved Jobs
    useEffect(() => {

        let active = true;

        if (!isAuthenticated || user?.role !== "jobseeker") {
            return undefined;
        }

        axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS)
            .then(({ data }) => {

                if (active) {
                    setSavedIds(
                        new Set(
                            data.map(saved => saved.job?._id).filter(Boolean)
                        )
                    );
                }

            })
            .catch(requestError => {

                toast.error(
                    requestError.response?.data?.message ||
                    "Could not load saved jobs"
                );

            });

        return () => {
            active = false;
        };

    }, [isAuthenticated, user?.role]);


    // Update Filters
    const updateFilter = (event) => {

        setFilters(current => ({
            ...current,
            [event.target.name]: event.target.value
        }));

    };


    // Search Jobs
    const handleSearch = (event) => {

        event.preventDefault();
        setSubmittedFilters({ ...filters });

    };


    // Clear Filters
    const clearFilters = () => {

        setFilters(initialFilters);
        setSubmittedFilters(initialFilters);

    };


    // Save / Unsave Jobs
    const toggleSave = async (job) => {

        if (!isAuthenticated || user?.role !== "jobseeker") {
            navigate("/login");
            return;
        }

        const wasSaved = savedIds.has(job._id);

        try {

            if (wasSaved) {

                await axiosInstance.delete(
                    API_PATHS.JOBS.UNSAVE_JOB(job._id)
                );

                setSavedIds(current => {

                    const next = new Set(current);
                    next.delete(job._id);

                    return next;

                });

                toast.success("Job removed from saved jobs");

            } else {

                await axiosInstance.post(
                    API_PATHS.JOBS.SAVE_JOB(job._id)
                );

                setSavedIds(current => new Set(current).add(job._id));

                toast.success("Job saved successfully");

            }

        } catch (requestError) {

            toast.error(
                requestError.response?.data?.message ||
                "Could not update saved jobs"
            );

        }

    };


    const activeFilters = Object.values(submittedFilters).filter(Boolean).length;
    const resumeStatus = user?.resume ? "Ready" : "Add resume";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".jobseeker-profile-menu")) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (

        <div className="min-h-screen bg-slate-50">

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

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 p-6 text-white shadow-xl shadow-slate-200 sm:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
                                <Sparkles size={13} />
                                Career dashboard
                            </div>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Find your next big move.</h1>
                            <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">
                                Explore curated opportunities, track your saved roles and applications, and keep your profile recruiter-ready.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                            <SummaryCard title="Open roles" value={jobs.length} icon={BriefcaseBusiness} accent="bg-blue-500" />
                            <SummaryCard title="Saved" value={savedIds.size} icon={Bookmark} accent="bg-violet-500" />
                            <SummaryCard title="Filters" value={activeFilters} icon={SlidersHorizontal} accent="bg-amber-500" />
                            <SummaryCard title="Resume" value={resumeStatus} icon={UserCircle} accent="bg-emerald-500" />
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <form onSubmit={handleSearch} className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_auto]">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3">
                            <Search size={18} className="text-blue-600" />
                            <input
                                name="keyword"
                                value={filters.keyword}
                                onChange={updateFilter}
                                placeholder="Job title or keyword"
                                className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3">
                            <MapPin size={18} className="text-blue-600" />
                            <input
                                name="location"
                                value={filters.location}
                                onChange={updateFilter}
                                placeholder="Location"
                                className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3">
                            <Building2 size={18} className="text-blue-600" />
                            <input
                                name="company"
                                value={filters.company}
                                onChange={updateFilter}
                                placeholder="Company"
                                className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Search size={18} />
                            Search Jobs
                        </button>
                    </form>
                </section>

                <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr]">
                    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-blue-600" />
                                <h2 className="font-bold text-slate-900">Filters</h2>
                            </div>
                            <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Clear All</button>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-slate-700">Job Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={updateFilter}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(item => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-semibold text-slate-700">Employment Type</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={updateFilter}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">All Job Types</option>
                                {JOB_TYPES.map(item => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => setSubmittedFilters({ ...filters })}
                            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>

                        {isAuthenticated && (
                            <Link to="/saved-jobs" className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 p-3 text-blue-700 transition hover:bg-blue-100">
                                <span className="flex items-center gap-2 text-sm font-semibold">
                                    <Bookmark size={17} />
                                    Saved Jobs
                                </span>
                                <ArrowRight size={16} />
                            </Link>
                        )}
                    </aside>

                    <section className="min-w-0">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Latest Opportunities</h2>
                                </div>
                                <p className="mt-1.5 text-sm text-slate-500">Explore the latest jobs matching your career goals.</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-bold">
                                <BriefcaseBusiness size={16} />
                                {jobs.length} opening{jobs.length !== 1 ? "s" : ""} found
                            </div>
                        </div>

                        {activeFilters > 0 && (
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">Active filters:</span>
                                {Object.entries(submittedFilters)
                                    .filter(([, value]) => value)
                                    .map(([key, value]) => (
                                        <span key={key} className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                            {value}
                                            <button onClick={() => {
                                                const nextFilters = { ...filters, [key]: "" };
                                                setFilters(nextFilters);
                                                setSubmittedFilters(nextFilters);
                                            }} aria-label={`Remove ${key} filter`}>
                                                <X size={13} />
                                            </button>
                                        </span>
                                    ))}
                            </div>
                        )}

                        {loading ? (
                            <div className="rounded-3xl border border-slate-200 bg-white py-14 shadow-sm">
                                <LoadingSpinner />
                            </div>
                        ) : error ? (
                            <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                                <h3 className="font-bold text-slate-800">Unable to load jobs</h3>
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                                <button onClick={() => setSubmittedFilters({ ...submittedFilters })} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                                    <RotateCcw size={16} />
                                    Try Again
                                </button>
                            </div>
                        ) : jobs.length ? (
                            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                {jobs.map(job => (
                                    <JobCard
                                        key={job._id}
                                        job={job}
                                        isSaved={savedIds.has(job._id)}
                                        onToggleSave={toggleSave}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Search size={29} />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">No matching jobs found</h3>
                                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">We couldn't find any jobs matching your search. Try changing your keywords or filters.</p>
                                <button onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                                    <RotateCcw size={16} />
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );

}

export default JobSeekerDashboard;