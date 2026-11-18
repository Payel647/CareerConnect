import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";

function AuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        role,
        action = "signup"
    } = location.state || {};

    const [countdown, setCountdown] = useState(3);

    const dashboardPath =
        role === "jobseeker"
            ? "/find-jobs"
            : role === "employer"
            ? "/employer-dashboard"
            : "/";
    console.log("AuthSuccess role:", role);
    console.log("Redirecting to:", dashboardPath);
    useEffect(() => {
        if (!role) {
            navigate("/login", { replace: true });
            return;
        }

        if (countdown === 0) {
            navigate(dashboardPath, { replace: true });
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [countdown, role, dashboardPath, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 text-center"
            >

                {/* SUCCESS ICON */}
                <div className="flex justify-center mb-7">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 180
                        }}
                        className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30" />

                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                            <Check
                                size={36}
                                strokeWidth={3}
                                className="text-white"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* SUCCESS MESSAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm mb-3">
                        <Sparkles size={17} />

                        {action === "login"
                            ? "WELCOME BACK!"
                            : "WELCOME ABOARD!"}
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
                        {action === "login"
                            ? "Login Successful!"
                            : "You're All Set!"}
                    </h1>

                    <p className="text-gray-500 leading-relaxed mb-7">
                        {action === "login"
                            ? "You have successfully signed in to your account."
                            : "Your account has been created successfully."}
                    </p>
                </motion.div>

                {/* ACCOUNT STATUS */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-7">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                        <Check size={19} />

                        {action === "login"
                            ? "Authentication Successful"
                            : "Registration Successful"}
                    </div>

                    <p className="text-green-600 text-xs mt-1">
                        Your account is ready to use.
                    </p>
                </div>

                {/* COUNTDOWN */}
                <p className="text-sm text-gray-500 mb-4">
                    Redirecting to your dashboard in
                    <span className="font-bold text-blue-600 mx-1">
                        {countdown}
                    </span>
                    seconds...
                </p>

                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-7">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${((3 - countdown) / 3) * 100}%`
                        }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    />
                </div>

                {/* MANUAL REDIRECT */}
                <button
                    onClick={() =>
                        navigate(dashboardPath, { replace: true })
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                    Go to Dashboard
                    <ArrowRight size={19} />
                </button>

            </motion.div>
        </div>
    );
}

export default AuthSuccess;