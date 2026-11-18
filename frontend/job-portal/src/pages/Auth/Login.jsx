import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    Loader,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';
import {useAuth} from "../../context/useAuth";
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from '../../utils/apiPaths';
function Login() {
    const navigate = useNavigate();
    const {login}=useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        showPassword: false,
        success: false
    });

    // 1. Email Validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            return "Email is required";
        }

        if (!emailRegex.test(email)) {
            return "Please enter a valid email";
        }

        return "";
    };

    // 2. Password Validation
    const validatePassword = (password) => {
        if (!password) {
            return "Password is required";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters";
        }

        return "";
    };

    // 3. Handle Input Change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setFormState(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [name]: ""
            }
        }));
    };

    // 4. Validate Form
    const validateForm = () => {
        const errors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password)
        };

        setFormState(prev => ({
            ...prev,
            errors
        }));

        return !Object.values(errors).some(error => error !== "");
    };

    // 5. Handle Form Submission
  
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState(prev => ({
        ...prev,
        loading: true,
        errors: {},
        success: false
    }));

    try {
        const response = await axiosInstance.post(
            API_PATHS.AUTH.LOGIN,
            {
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe
            }
        );

        const { token, role } = response.data;
         console.log("Login response:", response.data);
         console.log("Logged-in role:", role);
        if (!token || !role) {
            throw new Error("Invalid login response");
        }

        // Save user authentication
        login(response.data, token);

        setFormState(prev => ({
            ...prev,
            loading: false,
            success: true,
            errors: {}
        }));

        // Navigate to common success page
        navigate("/auth-success", {
            replace: true,
            state: {
                role: role,
                action: "login"
            }
        });

    } catch (error) {
        setFormState(prev => ({
            ...prev,
            loading: false,
            success: false,
            errors: {
                submit:
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed. Check your credentials."
            }
        }));
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
            >

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h2>

                    <p className="text-gray-600">
                        Sign in to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                    formState.errors.email
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                        </div>

                        {formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {formState.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                id="password"
                                name="password"
                                type={formState.showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                                    formState.errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }`}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setFormState(prev => ({
                                        ...prev,
                                        showPassword: !prev.showPassword
                                    }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {formState.showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {formState.errors.password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {formState.errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                            />
                            Remember me
                        </label>

                    </div>

                    {/* Submit Error */}
                    {formState.errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {formState.errors.submit}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={formState.loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {formState.loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Create One here
                            </Link>
                        </p>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}

export default Login;