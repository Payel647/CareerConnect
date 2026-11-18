import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    Bookmark,
    BriefcaseBusiness,
    Camera,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    FileText,
    Globe,
    GraduationCap,
    LogOut,
    MapPin,
    Phone,
    Plus,
    Save,
    Trash2,
    Upload,
    UserCircle,
    UserRound,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const initialProfile = {
    name: "",
    title: "",
    bio: "",
    location: "",
    phone: "",
    portfolio: "",
    experience: "",
    education: "",
    availability: "",
};

function UserProfile() {
    const { user, updateUser, isAuthenticated, logout } = useAuth();
    const resumeInput = useRef(null);
    const avatarInput = useRef(null);

    const [profile, setProfile] = useState({
        ...initialProfile,
        name: user?.name || "",
        title: user?.title || "",
        bio: user?.bio || "",
        location: user?.location || "",
        phone: user?.phone || "",
        portfolio: user?.portfolio || "",
        experience: user?.experience || "",
        education: user?.education || "",
        availability: user?.availability || "",
    });

    const [skillsList, setSkillsList] = useState(user?.skills || []);
    const [skillInput, setSkillInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Profile completeness calculation
    const completeness = useMemo(() => {
        const checks = [
            Boolean(user?.avatar),
            Boolean(profile.name?.trim()),
            Boolean(profile.title?.trim()),
            Boolean(profile.location?.trim()),
            Boolean(profile.phone?.trim()),
            skillsList.length > 0,
            Boolean(profile.experience?.trim()),
            Boolean(profile.education?.trim()),
            Boolean(profile.bio?.trim()),
            Boolean(user?.resume),
        ];
        const filled = checks.filter(Boolean).length;
        return Math.round((filled / checks.length) * 100);
    }, [profile, skillsList, user?.avatar, user?.resume]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
    };

    const addSkill = (rawSkill) => {
        const cleaned = rawSkill.trim();
        if (!cleaned) return;
        if (!skillsList.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
            setSkillsList((prev) => [...prev, cleaned]);
        }
        setSkillInput("");
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(skillInput);
        } else if (e.key === "Backspace" && !skillInput && skillsList.length > 0) {
            setSkillsList((prev) => prev.slice(0, -1));
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const finalSkills = skillInput.trim()
                ? Array.from(new Set([...skillsList, skillInput.trim()]))
                : skillsList;

            if (skillInput.trim()) {
                setSkillsList(finalSkills);
                setSkillInput("");
            }

            const payload = {
                ...profile,
                skills: finalSkills,
            };
            const { data } = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, payload);
            updateUser(data);
            toast.success("Profile updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const uploadResume = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Resume must be a PDF file");
            event.target.value = "";
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Resume must be smaller than 10 MB");
            event.target.value = "";
            return;
        }

        setUploadingResume(true);
        try {
            const formData = new FormData();
            formData.append("resume", file);
            const { data: uploaded } = await axiosInstance.post(API_PATHS.USERS.UPLOAD_RESUME, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const { data: profileData } = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, {
                resume: uploaded.resumeUrl,
            });
            updateUser(profileData);
            toast.success("Resume uploaded");
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.response?.data?.error || "Could not upload resume"
            );
        } finally {
            setUploadingResume(false);
            event.target.value = "";
        }
    };

    const deleteResume = async () => {
        try {
            await axiosInstance.delete(API_PATHS.USERS.DELETE_RESUME);
            updateUser({ resume: "" });
            toast.success("Resume deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete resume");
        }
    };

    const uploadAvatar = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
            toast.error("Choose an image smaller than 5 MB");
            event.target.value = "";
            return;
        }
        setUploadingAvatar(true);
        try {
            const body = new FormData();
            body.append("image", file);
            const { data: uploaded } = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, body, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const { data: profileData } = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, {
                avatar: uploaded.imageUrl,
            });
            updateUser(profileData);
            toast.success("Profile photo updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not upload profile photo");
        } finally {
            setUploadingAvatar(false);
            event.target.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Exact Original Navbar */}
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
            <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
                {/* Clean Top Profile Identity Card */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="relative shrink-0">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="Profile"
                                        className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-50 sm:h-20 sm:w-20"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-4 ring-blue-50 sm:h-20 sm:w-20">
                                        <UserRound size={30} />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    disabled={uploadingAvatar}
                                    onClick={() => avatarInput.current?.click()}
                                    title="Change profile photo"
                                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50"
                                >
                                    <Camera size={14} />
                                </button>
                                <input
                                    ref={avatarInput}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={uploadAvatar}
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {user?.name || "Your name"}
                                    </h1>
                                    {profile.availability && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {profile.availability}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm font-medium text-slate-600">
                                    {profile.title || "Add your professional title"}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                    {user?.email && <span>{user.email}</span>}
                                    {profile.location && (
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={14} className="text-slate-400" />
                                            {profile.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Strength Box */}
                        <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 md:w-64">
                            <div className="flex items-center justify-between text-sm font-semibold">
                                <span className="text-slate-700">Profile Strength</span>
                                <span className={completeness === 100 ? "text-emerald-600" : "text-blue-600"}>
                                    {completeness}%
                                </span>
                            </div>
                            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        completeness === 100 ? "bg-emerald-500" : "bg-blue-600"
                                    }`}
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                                {completeness === 100
                                    ? "All set! Your profile is recruiter-ready."
                                    : "Complete all fields & resume to stand out."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Two-Column Layout */}
                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Left Column: Structured Profile Form */}
                    <form
                        onSubmit={saveProfile}
                        className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        {/* Section 1: Basic Information */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                How recruiters and hiring managers identify and contact you.
                            </p>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                                    Full name
                                    <input
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    Professional title
                                    <input
                                        name="title"
                                        value={profile.title}
                                        onChange={handleChange}
                                        placeholder="Frontend Developer"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    Availability
                                    <input
                                        name="availability"
                                        value={profile.availability}
                                        onChange={handleChange}
                                        placeholder="Available immediately"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    Location
                                    <div className="relative mt-2">
                                        <MapPin
                                            size={16}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            name="location"
                                            value={profile.location}
                                            onChange={handleChange}
                                            placeholder="Dhaka, Bangladesh"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    Phone
                                    <div className="relative mt-2">
                                        <Phone
                                            size={16}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            placeholder="+880 17..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </label>

                                <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                                    Email address
                                    <input
                                        value={user?.email || ""}
                                        readOnly
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Section 2: Links & Technical Skills */}
                        <div className="border-t border-slate-200 pt-7">
                            <h2 className="text-lg font-bold text-slate-900">Links & Technical Skills</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Highlight your portfolio and core technologies.
                            </p>

                            <div className="mt-5 space-y-5">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Portfolio / LinkedIn / GitHub
                                    <div className="relative mt-2">
                                        <Globe
                                            size={16}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            name="portfolio"
                                            value={profile.portfolio}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </label>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700">
                                        Skills <span className="font-normal text-slate-400">(Press Enter or comma to add)</span>
                                    </label>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                                        {skillsList.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-200"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="rounded p-0.5 text-blue-500 hover:bg-blue-100 hover:text-blue-800"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            placeholder={skillsList.length === 0 ? "React, Node.js, MongoDB..." : "Add skill..."}
                                            className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-slate-900 placeholder-slate-400 outline-none"
                                        />
                                        {skillInput.trim() && (
                                            <button
                                                type="button"
                                                onClick={() => addSkill(skillInput)}
                                                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                                            >
                                                <Plus size={13} />
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Background & Summary */}
                        <div className="border-t border-slate-200 pt-7">
                            <h2 className="text-lg font-bold text-slate-900">Background & Summary</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Share your work history, academic qualifications, and career goals.
                            </p>

                            <div className="mt-5 space-y-5">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Experience
                                    <textarea
                                        name="experience"
                                        value={profile.experience}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Describe your recent work experience, roles, and impact."
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    Education
                                    <textarea
                                        name="education"
                                        value={profile.education}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Degree, institution, year, certifications"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>

                                <label className="block text-sm font-semibold text-slate-700">
                                    About me / Bio
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="A short summary of your expertise and goals"
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-5">
                            <button
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save size={17} />
                                {saving ? "Saving..." : "Save profile"}
                            </button>
                        </div>
                    </form>

                    {/* Right Column: Sticky Resume Card */}
                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Resume / CV</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Upload a PDF (up to 10 MB). Employers will receive this file with your application.
                                    </p>
                                </div>
                            </div>

                            {user?.resume ? (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    Resume_Uploaded.pdf
                                                </p>
                                                <p className="text-xs font-medium text-emerald-600">
                                                    Ready for applications
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={deleteResume}
                                            type="button"
                                            aria-label="Delete resume"
                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
                                        <a
                                            href={user.resume}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <ExternalLink size={14} />
                                            Preview PDF
                                        </a>
                                        <button
                                            type="button"
                                            disabled={uploadingResume}
                                            onClick={() => resumeInput.current?.click()}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <Upload size={14} />
                                            {uploadingResume ? "Uploading..." : "Replace"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    disabled={uploadingResume}
                                    onClick={() => resumeInput.current?.click()}
                                    className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40 disabled:opacity-50"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <Upload size={22} />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-slate-800">
                                        {uploadingResume ? "Uploading..." : "Click to upload your resume"}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">PDF only • Max 10 MB</p>
                                </button>
                            )}

                            <input
                                ref={resumeInput}
                                type="file"
                                accept="application/pdf,.pdf"
                                className="hidden"
                                onChange={uploadResume}
                            />
                        </section>

                        {/* Quick Shortcuts Card */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Quick Shortcuts
                            </h3>
                            <div className="mt-3 space-y-2">
                                <Link
                                    to="/my-applications"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                                >
                                    <GraduationCap size={17} className="text-slate-400" />
                                    Track My Applications
                                </Link>
                                <Link
                                    to="/saved-jobs"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                                >
                                    <Bookmark size={17} className="text-slate-400" />
                                    View Saved Jobs
                                </Link>
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default UserProfile;