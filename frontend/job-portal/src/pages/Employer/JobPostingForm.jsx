import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";

const blankJob = {
    title: "",
    location: "",
    category: "",
    type: "Full-time",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
};

function JobPostingForm() {
    const { state } = useLocation();
    const job = state?.job;
    const navigate = useNavigate();
    const [form, setForm] = useState(job ? {
        ...blankJob,
        ...job,
        salaryMin: job.salaryMin ?? "",
        salaryMax: job.salaryMax ?? "",
    } : blankJob);
    const [saving, setSaving] = useState(false);

    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = async (event) => {
        event.preventDefault();
        const payload = {
            ...form,
            salaryMin: form.salaryMin === "" ? undefined : Number(form.salaryMin),
            salaryMax: form.salaryMax === "" ? undefined : Number(form.salaryMax),
        };
        if (payload.salaryMin !== undefined && payload.salaryMax !== undefined && payload.salaryMin > payload.salaryMax) {
            toast.error("Minimum salary cannot exceed maximum salary");
            return;
        }
        setSaving(true);
        try {
            if (job?._id) {
                await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(job._id), payload);
                toast.success("Job updated");
            } else {
                await axiosInstance.post(API_PATHS.JOBS.POST_JOB, payload);
                toast.success("Job posted");
            }
            navigate("/manage-jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not save this job");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout activeMenu="post-job">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900">{job?._id ? "Edit job" : "Post a new job"}</h1>
                <p className="mt-1 text-gray-500">Share role details so candidates know what to expect.</p>
                <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                    <label className="block text-sm font-medium text-gray-700">Job title *
                        <input name="title" value={form.title} onChange={updateField} required maxLength={120} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="e.g. Frontend Engineer" />
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-medium text-gray-700">Location
                            <input name="location" value={form.location} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="City or Remote" />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">Job type *
                            <select name="type" value={form.type} onChange={updateField} required className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3">
                                {JOB_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                        </label>
                        <label className="block text-sm font-medium text-gray-700">Category
                            <select name="category" value={form.category} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3">
                                <option value="">Select category</option>
                                {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="block text-sm font-medium text-gray-700">Minimum salary
                                <input name="salaryMin" type="number" min="0" value={form.salaryMin} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">Maximum salary
                                <input name="salaryMax" type="number" min="0" value={form.salaryMax} onChange={updateField} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3" />
                            </label>
                        </div>
                    </div>
                    <label className="block text-sm font-medium text-gray-700">Description *
                        <textarea name="description" value={form.description} onChange={updateField} required rows={6} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="Describe the role and what the successful candidate will do." />
                    </label>
                    <label className="block text-sm font-medium text-gray-700">Requirements *
                        <textarea name="requirements" value={form.requirements} onChange={updateField} required rows={5} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="List skills, experience, and qualifications." />
                    </label>
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <button type="button" onClick={() => navigate("/manage-jobs")} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : job?._id ? "Save changes" : "Publish job"}</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default JobPostingForm;
