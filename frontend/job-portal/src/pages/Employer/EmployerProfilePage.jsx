import { useRef, useState } from "react";
import { Building2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

function EmployerProfilePage() {
    const { user, updateUser } = useAuth();
    const logoInput = useRef(null);
    const [form, setForm] = useState({
        companyName: user?.companyName || "",
        companyDescription: user?.companyDescription || "",
        companyLogo: user?.companyLogo || "",
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const uploadLogo = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
            toast.error("Choose an image smaller than 5 MB");
            event.target.value = "";
            return;
        }
        setUploading(true);
        try {
            const body = new FormData();
            body.append("image", file);
            const { data } = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, body, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setForm((current) => ({ ...current, companyLogo: data.imageUrl }));
            toast.success("Logo uploaded");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not upload logo");
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    const save = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const { data } = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, form);
            updateUser(data);
            toast.success("Company profile updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update company profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout activeMenu="company-profile">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900">Company profile</h1>
                <p className="mt-1 text-gray-500">Help candidates learn about your company.</p>
                <form onSubmit={save} className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        {form.companyLogo ? <img src={form.companyLogo} alt="Company logo" className="h-16 w-16 rounded-xl border border-gray-200 object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Building2 size={26} /></div>}
                        <div>
                            <p className="font-semibold text-gray-900">Company logo</p>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPEG or WebP, up to 5 MB</p>
                            <button type="button" disabled={uploading} onClick={() => logoInput.current?.click()} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 disabled:opacity-50"><Upload size={15} />{uploading ? "Uploading..." : "Upload logo"}</button>
                            <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadLogo} />
                        </div>
                    </div>
                    <label className="block text-sm font-medium text-gray-700">Company name
                        <input name="companyName" value={form.companyName} onChange={updateField} required maxLength={120} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" />
                    </label>
                    <label className="block text-sm font-medium text-gray-700">About your company
                        <textarea name="companyDescription" value={form.companyDescription} onChange={updateField} rows={6} maxLength={3000} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="Describe your company and what makes it a great place to work." />
                    </label>
                    <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save company profile"}</button>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default EmployerProfilePage;
