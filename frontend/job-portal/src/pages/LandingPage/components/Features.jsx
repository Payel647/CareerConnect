import { employerFeatures, jobSeekerFeatures } from "../../../utils/data";

function Features() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Everything You Need to
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Succeed
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our platform offers a comprehensive suite of features
                        designed to empower both job seekers and employers,
                        making the job search and hiring process seamless and efficient.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Job Seeker Section */}
                    <div>
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                For Job Seekers
                            </h3>

                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto" />
                        </div>

                        <div className="space-y-4">
                            {jobSeekerFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex group items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Feature Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-all duration-300" />
                                    </div>

                                    {/* Feature Content */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {feature.title}
                                        </h4>

                                        <p className="text-gray-600 text-base mt-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employer Section */}
                    <div>
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                For Employers
                            </h3>

                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
                        </div>

                        <div className="space-y-4">
                            {employerFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex group items-start space-x-4 p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Feature Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-purple-600 group-hover:text-white transition-all duration-300" />
                                    </div>

                                    {/* Feature Content */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {feature.title}
                                        </h4>

                                        <p className="text-gray-600 text-base mt-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Features;