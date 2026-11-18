import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Briefcase, Target, Users } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const cards = [
    { key: "jobseekers", icon: Users, title: "Job Seekers", color: "blue" },
    { key: "openJobs", icon: Briefcase, title: "Open Jobs", color: "purple" },
    { key: "successfulHires", icon: Target, title: "Successful Hires", color: "green" },
    { key: "employers", icon: Building2, title: "Employers", color: "orange" },
];

const colorStyles = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
};

function Analytics() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        axiosInstance.get(API_PATHS.DASHBOARD.PLATFORM_OVERVIEW)
            .then(({ data }) => { if (active) setStats(data); })
            .catch((requestError) => {
                if (active) setError(requestError.response?.data?.message || "Platform totals are temporarily unavailable.");
            });
        return () => { active = false; };
    }, []);

    return (
        <section className="relative mb-12 overflow-hidden bg-white py-4">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                        Platform{" "}
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Analytics
                        </span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-gray-600">
                        Current totals from jobs, employers, candidates and completed hires on the platform.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        const value = stats ? Number(stats[card.key] || 0).toLocaleString() : error ? "—" : "…";
                        return (
                            <motion.div
                                key={card.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[card.color]}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-3xl font-bold text-gray-900">{value}</h3>
                                <p className="font-medium text-gray-500">{card.title}</p>
                            </motion.div>
                        );
                    })}
                </div>
                {error && <p role="status" className="mt-4 text-center text-sm text-gray-500">{error}</p>}
            </div>
        </section>
    );
}

export default Analytics;
