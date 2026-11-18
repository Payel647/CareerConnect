import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    ArrowRight,
    Camera,
    CheckCircle2,
    Building2
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
function Signup() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        avatar: null
    });

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Select Profile Photo
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            e.target.value = "";
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setFormData((prev) => ({
            ...prev,
            avatar: file
        }));

        setPreview(URL.createObjectURL(file));
    };

    // Remove Profile Photo
    const removePhoto = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview(null);

        setFormData((prev) => ({
            ...prev,
            avatar: null
        }));

        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    // Select Role
    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            role
        }));
    };

    // Handle Signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            alert("Please select your role.");
            return;
        }

        try {
            setLoading(true);

            let avatarUrl = "";

            // STEP 1: Upload Profile Image
            if (formData.avatar) {
                const imageFormData = new FormData();

                imageFormData.append("image", formData.avatar);

                const imageResponse = await fetch(
                    "http://localhost:8000/api/auth/upload-image",
                    {
                        method: "POST",
                        body: imageFormData
                    }
                );

                const imageResult = await imageResponse.json();

                if (!imageResponse.ok) {
                    throw new Error(
                        imageResult.error ||
                        imageResult.message ||
                        "Image upload failed."
                    );
                }

                avatarUrl = imageResult.imageUrl;
            }

            // STEP 2: Prepare Registration Data
            const payload = {
                name: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                avatar: avatarUrl
            };

            // STEP 3: Register User
            const response = await fetch(
                "http://localhost:8000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Signup failed."
                );
            }

            // STEP 4: Check Token
            if (!data.token) {
                throw new Error("Token not received from server.");
            }

            // STEP 5: Save User and Token
            const { token, ...userData } = data;
            login(userData, token);
            navigate("/auth-success", {
              replace: true,
              state: {
                role: userData.role,
                action: "signup"
              }
            });
     
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">

                    <div className="flex flex-col justify-center">

                        <div className="max-w-md w-full mx-auto">

                            {/* HEADING */}
                            <div className="mb-7">

                                <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
                                    Create an Account
                                </h2>

                                <p className="text-gray-500 text-center">
                                    Join our community and discover new possibilities.
                                </p>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* PROFILE PHOTO */}
                                <div className="flex flex-col items-center mb-6">

                                    <div className="relative">

                                        <div className="w-24 h-24 rounded-full bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center overflow-hidden">

                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Profile Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-10 h-10 text-blue-500" />
                                            )}

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center border-4 border-white hover:from-blue-700 hover:to-purple-700 transition"
                                        >
                                            <Camera size={16} />
                                        </button>

                                    </div>

                                    <input
                                        type="file"
                                        ref={fileRef}
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />

                                    <div className="flex items-center gap-2 mt-3">

                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="text-sm text-blue-600 font-semibold hover:text-purple-600 hover:underline"
                                        >
                                            Upload Profile Photo
                                        </button>

                                        <span className="text-gray-400 text-xs">
                                            (Optional)
                                        </span>

                                    </div>

                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="text-xs text-red-500 mt-2 hover:underline"
                                        >
                                            Remove Photo
                                        </button>
                                    )}

                                    <p className="text-xs text-gray-400 mt-1">
                                        JPG, PNG or WEBP · Max 5MB
                                    </p>

                                </div>

                                {/* ROLE SELECTION */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        I want to join as
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">

                                        {/* JOB SEEKER */}
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange("jobseeker")}
                                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                                formData.role === "jobseeker"
                                                    ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100"
                                                    : "border-gray-200 hover:border-blue-300"
                                            }`}
                                        >

                                            {formData.role === "jobseeker" && (
                                                <CheckCircle2
                                                    className="absolute top-3 right-3 text-blue-600"
                                                    size={19}
                                                />
                                            )}

                                            <div
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                                                    formData.role === "jobseeker"
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                <User size={23} />
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-sm">
                                                Job Seeker
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Find your dream job
                                            </p>

                                        </button>

                                        {/* EMPLOYER */}
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange("employer")}
                                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                                formData.role === "employeer"
                                                    ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100"
                                                    : "border-gray-200 hover:border-blue-300"
                                            }`}
                                        >

                                            {formData.role === "employer" && (
                                                <CheckCircle2
                                                    className="absolute top-3 right-3 text-blue-600"
                                                    size={19}
                                                />
                                            )}

                                            <div
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                                                    formData.role === "employer"
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                <Building2 size={23} />
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-sm">
                                                Employer
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Hire talented people
                                            </p>

                                        </button>

                                    </div>

                                </div>

                                {/* FULL NAME */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <User
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={19}
                                        />

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={19}
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                </div>

                                {/* PASSWORD */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={19}
                                        />

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            required
                                            minLength={8}
                                            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>

                                    </div>

                                    <p className="text-xs text-gray-400 mt-2">
                                        Password must contain at least 8 characters.
                                    </p>

                                </div>

                                {/* TERMS */}
                                <div className="flex items-start gap-2">

                                    <input
                                        type="checkbox"
                                        id="terms"
                                        required
                                        className="w-4 h-4 mt-1 accent-blue-600"
                                    />

                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-gray-500 leading-5"
                                    >
                                        I agree to the{" "}

                                        <Link
                                            to="/terms"
                                            className="text-blue-600 font-semibold hover:text-purple-600 hover:underline"
                                        >
                                            Terms of Service
                                        </Link>

                                        {" "}and{" "}

                                        <Link
                                            to="/privacy"
                                            className="text-blue-600 font-semibold hover:text-purple-600 hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>

                                    </label>

                                </div>

                                {/* SUBMIT BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"
                                    }

                                    {!loading && (
                                        <ArrowRight size={19} />
                                    )}

                                </button>

                            </form>

                            {/* LOGIN LINK */}
                            <p className="text-center text-gray-500 mt-7 text-sm">

                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="text-blue-600 font-semibold hover:text-purple-600 hover:underline"
                                >
                                    Sign In
                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </motion.div>
    );
}

export default Signup;