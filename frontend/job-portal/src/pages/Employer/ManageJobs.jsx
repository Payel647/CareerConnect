import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Edit3, Eye, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

function ManageJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER)
            .then(({ data }) => { if (active) setJobs(data); })
            .catch((error) => toast.error(error.response?.data?.message || "Could not load your jobs"))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const toggleStatus = async (job) => {
        try {
            await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(job._id));
            setJobs((current) => current.map((item) => item._id === job._id ? { ...item, isClosed: !item.isClosed } : item));
            toast.success(job.isClosed ? "Job reopened" : "Job closed");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update job status");
        }
    };

    const deleteJob = async (job) => {
        if (!window.confirm(`Delete "${job.title}" and its applications? This cannot be undone.`)) return;
        try {
            await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(job._id));
            setJobs((current) => current.filter((item) => item._id !== job._id));
            toast.success("Job deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete job");
        }
    };

    return (
        <DashboardLayout activeMenu="manage-jobs">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div><h1 className="text-2xl font-bold text-gray-900">Manage jobs</h1><p className="mt-1 text-gray-500">Edit openings and review candidate activity.</p></div>
                    <button onClick={() => navigate("/post-job")} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"><Plus size={18} /> Post a job</button>
                </div>
                {loading ? <div className="mt-8"><LoadingSpinner /></div> : jobs.length ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="divide-y divide-gray-100">
                            {jobs.map((job) => (
                                <article key={job._id} className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><Briefcase size={21} /></div>
                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-gray-900">{job.title}</h2>
                                            <p className="mt-1 text-sm text-gray-500">{[job.location, job.type, job.category].filter(Boolean).join(" · ")}</p>
                                            <p className="mt-2 text-xs text-gray-500">{job.applicationCount || 0} applicant{job.applicationCount === 1 ? "" : "s"} · {job.isClosed ? "Closed" : "Active"}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => navigate(`/applicants?jobId=${job._id}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Eye size={16} /> Applicants</button>
                                        <button onClick={() => navigate("/post-job", { state: { job } })} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><Edit3 size={16} /> Edit</button>
                                        <button onClick={() => toggleStatus(job)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{job.isClosed ? "Reopen" : "Close"}</button>
                                        <button onClick={() => deleteJob(job)} aria-label={`Delete ${job.title}`} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                        <Briefcase className="mx-auto text-gray-400" size={34} />
                        <h2 className="mt-3 font-semibold text-gray-900">You haven’t posted any jobs</h2>
                        <p className="mt-1 text-sm text-gray-500">Create your first opening to start receiving applications.</p>
                        <button onClick={() => navigate("/post-job")} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">Post your first job</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ManageJobs;
