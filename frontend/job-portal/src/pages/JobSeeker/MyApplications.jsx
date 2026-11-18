import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowUpRight,
    Bookmark,
    BriefcaseBusiness,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileCheck2,
    MapPin,
    Search,
    Sparkles,
    X,
    ChevronDown,
    LogOut,
    UserCircle,
    XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/useAuth";
const STATUS_CONFIG = {
    Applied: {
        badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
        dot: "bg-blue-600",
        icon: FileCheck2,
    },
    "In Review": {
        badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
        dot: "bg-amber-500",
        icon: Clock,
    },
    Shortlisted: {
        badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
        dot: "bg-indigo-600",
        icon: Sparkles,
    },
    Accepted: {
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        dot: "bg-emerald-600",
        icon: CheckCircle2,
    },
    Rejected: {
        badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
        dot: "bg-rose-500",
        icon: XCircle,
    },
};

function ApplicationsSkeleton() {
    return (
        <div className="mt-6 space-y-6">
            {/* Stat Pills Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"
                    >
                        <div className="h-3.5 w-20 animate-pulse rounded bg-slate-200/80" />
                        <div className="mt-3 h-7 w-10 animate-pulse rounded-md bg-slate-200/80" />
                    </div>
                ))}
            </div>

            {/* Application Cards Skeleton */}
            <div className="space-y-3.5">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center"
                    >
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-200/80" />
                            <div className="space-y-2.5">
                                <div className="h-5 w-48 animate-pulse rounded bg-slate-200/80" />
                                <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200/70" />
                                <div className="flex gap-2 pt-1">
                                    <div className="h-5 w-24 animate-pulse rounded-md bg-slate-100" />
                                    <div className="h-5 w-28 animate-pulse rounded-md bg-slate-100" />
                                </div>
                            </div>
                        </div>
                        <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200/80" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let active = true;
        axiosInstance
            .get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS)
            .then(({ data }) => {
                if (active) setApplications(data.filter((app) => app.job));
            })
            .catch((error) =>
                toast.error(error.response?.data?.message || "Could not load your applications")
            )
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const statusCounts = useMemo(() => {
        const counts = {
            All: applications.length,
            Applied: 0,
            "In Review": 0,
            Shortlisted: 0,
            Accepted: 0,
            Rejected: 0,
        };
        applications.forEach((app) => {
            if (counts[app.status] !== undefined) {
                counts[app.status] += 1;
            } else {
                counts[app.status] = 1;
            }
        });
        return counts;
    }, [applications]);

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const matchesStatus = activeStatus === "All" || app.status === activeStatus;
            const query = searchQuery.trim().toLowerCase();
            if (!query) return matchesStatus;

            const title = (app.job?.title || "").toLowerCase();
            const company = (
                app.job?.company?.companyName ||
                app.job?.company?.name ||
                ""
            ).toLowerCase();
            const location = (app.job?.location || "").toLowerCase();

            return (
                matchesStatus &&
                (title.includes(query) || company.includes(query) || location.includes(query))
            );
        });
    }, [applications, activeStatus, searchQuery]);

    const visibleSummaryStatuses = ["All", "Applied", "In Review", "Shortlisted", "Accepted"].filter(
        (status) => status === "All" || statusCounts[status] > 0
    );
    const {isAuthenticated,logout,user} =useAuth();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 antialiased">
            {/* Sticky Glass Navbar (Matches JobDetails & SavedJobs) */}
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
                                <Link to="/find-jobs" className="hidden text-slate-600 transition hover:text-blue-700 sm:block">
                                    Find Jobs
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
                    <span className="text-slate-700">Applications</span>
                </nav>

                {/* Header Card */}
                <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">
                            <FileCheck2 size={13} />
                            Application Tracker
                        </div>
                        <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            My Applications
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                            Monitor your hiring pipeline, interview shortlists, and submission history in real time.
                        </p>
                    </div>

                    <Link
                        to="/find-jobs"
                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <Search size={16} />
                        Find More Roles
                        <ArrowRight size={15} />
                    </Link>
                </section>

                {loading ? (
                    <ApplicationsSkeleton />
                ) : applications.length > 0 ? (
                    <>
                        {/* Interactive Status Filter Cards */}
                        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {visibleSummaryStatuses.map((status) => {
                                const isActive = activeStatus === status;
                                const config = STATUS_CONFIG[status];
                                const IconComponent = config?.icon || BriefcaseBusiness;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => setActiveStatus(status)}
                                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                                            isActive
                                                ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/20"
                                                : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-xs font-semibold ${
                                                    isActive ? "text-blue-700" : "text-slate-500"
                                                }`}
                                            >
                                                {status === "All" ? "Total Applied" : status}
                                            </span>
                                            <IconComponent
                                                size={15}
                                                className={isActive ? "text-blue-600" : "text-slate-400"}
                                            />
                                        </div>
                                        <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                                            {statusCounts[status] || 0}
                                        </p>
                                    </button>
                                );
                            })}
                        </section>

                        {/* Search & Filter Controls */}
                        <section className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-xs">
                                <Search
                                    size={16}
                                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search role or company..."
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

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span>
                                    Showing <strong className="text-slate-800">{filteredApplications.length}</strong>{" "}
                                    {filteredApplications.length === 1 ? "application" : "applications"}
                                </span>
                                {activeStatus !== "All" && (
                                    <button
                                        onClick={() => setActiveStatus("All")}
                                        className="rounded-md bg-slate-200/70 px-2 py-1 font-semibold text-slate-700 hover:bg-slate-200"
                                    >
                                        Clear filter
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Application List */}
                        {filteredApplications.length > 0 ? (
                            <section className="mt-4 space-y-3.5">
                                {filteredApplications.map((application) => {
                                    const { job } = application;
                                    const companyName =
                                        job.company?.companyName || job.company?.name || "Company";
                                    const statusStyle = STATUS_CONFIG[application.status] || {
                                        badge: "bg-slate-100 text-slate-700 ring-slate-500/20",
                                        dot: "bg-slate-500",
                                    };

                                    const appliedDate = new Date(
                                        application.createdAt
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    });

                                    return (
                                        <article
                                            key={application._id}
                                            className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-start gap-4">
                                                {job.company?.companyLogo ? (
                                                    <img
                                                        src={job.company.companyLogo}
                                                        alt={`${companyName} logo`}
                                                        className="h-12 w-12 shrink-0 rounded-xl border border-slate-200/80 bg-white object-contain p-1.5"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                                                        <Building2 size={20} />
                                                    </div>
                                                )}

                                                <div>
                                                    <Link
                                                        to={`/job/${job._id}`}
                                                        className="inline-flex items-center gap-1.5 text-lg font-bold text-slate-900 transition group-hover:text-blue-600"
                                                    >
                                                        {job.title}
                                                        <ArrowUpRight
                                                            size={16}
                                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                                        />
                                                    </Link>

                                                    <p className="mt-0.5 text-sm font-medium text-slate-600">
                                                        {companyName}
                                                    </p>

                                                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                                        {job.location && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/80 px-2.5 py-1 font-medium text-slate-600">
                                                                <MapPin size={12} className="text-slate-400" />
                                                                {job.location}
                                                            </span>
                                                        )}

                                                        {job.type && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/80 px-2.5 py-1 font-medium text-slate-600">
                                                                <BriefcaseBusiness
                                                                    size={12}
                                                                    className="text-slate-400"
                                                                />
                                                                {job.type}
                                                            </span>
                                                        )}

                                                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100/80 px-2.5 py-1 font-medium text-slate-600">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            Applied {appliedDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge + View Link */}
                                            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle.badge}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                    />
                                                    {application.status}
                                                </span>

                                                <Link
                                                    to={`/job/${job._id}`}
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 sm:hidden"
                                                >
                                                    View Role
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </section>
                        ) : (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                                <p className="text-base font-semibold text-slate-800">
                                    No matching applications found
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Try clearing your search or switching back to "Total Applied".
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setActiveStatus("All");
                                    }}
                                    className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <BriefcaseBusiness size={28} strokeWidth={1.75} />
                        </div>
                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            You haven’t applied to any jobs yet
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Explore open roles that match your skills and submit your first application to track it here.
                        </p>
                        <Link
                            to="/find-jobs"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            <Search size={16} />
                            Browse Jobs
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyApplications;