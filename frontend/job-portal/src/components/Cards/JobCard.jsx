import { Bookmark, MapPin, Briefcase, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

function JobCard({ job, isSaved = false, onToggleSave }) {
    const companyName = job.company?.companyName || job.company?.name || "Company";

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
                {job.company?.companyLogo ? (
                    <img
                        src={job.company.companyLogo}
                        alt={`${companyName} logo`}
                        className="h-12 w-12 rounded-xl border border-gray-100 object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 size={22} />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <Link to={`/job/${job._id}`} className="font-semibold text-gray-900 hover:text-blue-700">
                                {job.title}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">{companyName}</p>
                        </div>
                        {onToggleSave && (
                            <button
                                type="button"
                                onClick={() => onToggleSave(job)}
                                aria-label={isSaved ? "Remove saved job" : "Save job"}
                                className={`rounded-lg p-2 transition ${isSaved ? "bg-blue-50 text-blue-700" : "text-gray-400 hover:bg-gray-100 hover:text-blue-700"}`}
                            >
                                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{job.location || "Location not specified"}</span>
                        <span className="inline-flex items-center gap-1.5"><Briefcase size={15} />{job.type || "Job type not specified"}</span>
                        {job.category && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{job.category}</span>}
                    </div>
                    {(job.salaryMin || job.salaryMax) && (
                        <p className="mt-3 text-sm font-medium text-gray-700">
                            {job.salaryMin ? `$${Number(job.salaryMin).toLocaleString()}` : ""}
                            {job.salaryMin && job.salaryMax ? " - " : ""}
                            {job.salaryMax ? `$${Number(job.salaryMax).toLocaleString()}` : ""}
                        </p>
                    )}
                </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">{job.description}</p>
            <div className="mt-4 flex justify-end">
                <Link to={`/job/${job._id}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                    View details <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
}

export default JobCard;
