import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Users } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const statuses = ["Applied", "In Review", "Shortlisted", "Rejected", "Accepted"];

function ApplicationViewer() {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [jobId, setJobId] = useState(searchParams.get("jobId") || "");
    const [applications, setApplications] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(false);

    useEffect(() => {
        let active = true;
        axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER)
            .then(({ data }) => {
                if (!active) return;
                setJobs(data);
                const requestedJob = searchParams.get("jobId");
                if (requestedJob && data.some((job) => job._id === requestedJob)) setJobId(requestedJob);
                else if (data.length) {
                    setJobId((current) => current && data.some((job) => job._id === current) ? current : data[0]._id);
                }
            })
            .catch((error) => toast.error(error.response?.data?.message || "Could not load jobs"))
            .finally(() => { if (active) setLoadingJobs(false); });
        return () => { active = false; };
    }, [searchParams]);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (!jobId) {
                if (active) setApplications([]);
                return undefined;
            }
            if (active) setLoadingApplications(true);
            return axiosInstance.get(API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId))
                .then(({ data }) => { if (active) setApplications(data); })
                .catch((error) => toast.error(error.response?.data?.message || "Could not load applicants"))
                .finally(() => { if (active) setLoadingApplications(false); });
        });
        return () => { active = false; };
    }, [jobId]);

    const changeStatus = async (application, status) => {
        try {
            await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(application._id), { status });
            setApplications((current) => current.map((item) => item._id === application._id ? { ...item, status } : item));
            toast.success("Application status updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update status");
        }
    };

    const selectedJob = jobs.find((job) => job._id === jobId);
    return (
        <DashboardLayout activeMenu="applicants">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div><h1 className="text-2xl font-bold text-gray-900">Applicants</h1><p className="mt-1 text-gray-500">Review candidate profiles and update application status.</p></div>
                    <label className="text-sm font-medium text-gray-700">Select job
                        <select disabled={loadingJobs || !jobs.length} value={jobId} onChange={(event) => setJobId(event.target.value)} className="mt-1 block min-w-64 rounded-lg border border-gray-300 bg-white px-3 py-2.5">
                            {!jobs.length && <option value="">No jobs available</option>}
                            {jobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
                        </select>
                    </label>
                </div>
                {loadingJobs || loadingApplications ? <div className="mt-8"><LoadingSpinner /></div> : applications.length ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 px-5 py-4"><h2 className="font-semibold text-gray-900">{selectedJob?.title || "Candidates"} <span className="ml-1 text-sm font-normal text-gray-500">({applications.length})</span></h2></div>
                        <div className="divide-y divide-gray-100">
                            {applications.map((application) => {
                                const applicant = application.applicant || {};
                                const resume = application.resume || applicant.resume;
                                const skills = Array.isArray(applicant.skills) ? applicant.skills.slice(0, 4) : [];
                                return (
                                    <article key={application._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            {applicant.avatar ? <img src={applicant.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Users size={20} /></div>}
                                             <div>
                                                <h3 className="font-semibold text-gray-900">{applicant.name || "Candidate"}</h3>
                                                <p className="text-xs text-gray-400">{applicant.location || "Location not provided"} • Applied {new Date(application.createdAt).toLocaleDateString()}</p>
                                                {skills.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {skills.map((skill) => (
                                                            <span key={skill} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">{skill}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {resume ? <a href={resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><Download size={16} /> Resume</a> : <span className="text-sm text-gray-400">No resume</span>}
                                            <label className="sr-only" htmlFor={`status-${application._id}`}>Application status</label>
                                            <select id={`status-${application._id}`} value={application.status} onChange={(event) => changeStatus(application, event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                                                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                        <Users className="mx-auto text-gray-400" size={34} />
                        <h2 className="mt-3 font-semibold text-gray-900">{jobId ? "No applications yet" : "Post a job to see applicants"}</h2>
                        <p className="mt-1 text-sm text-gray-500">Candidates who apply will appear here.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ApplicationViewer;
