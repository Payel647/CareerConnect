import { Briefcase, Heart } from 'lucide-react';
function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white relative overflow-hidden full-h-screen">
            <div className="absolute -top-32 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">

                <div className="py-14">
                    <div className="flex flex-col items-center text-center">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold tracking-tight">
                                Job<span className="text-blue-400">Portal</span>
                            </h3>

                        </div>

                        <p className="text-gray-400 text-sm md:text-base leading-7 max-w-lg">
                            Connecting Talent with innovative companies
                            worldwide. Your gateway to the future of work.
                        </p>

                    </div>

                </div>
                <div className="border-t border-white/10 py-6">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <p className="text-gray-500 text-sm text-center">
                            © {new Date().getFullYear()} Time to Program.
                            All rights reserved.
                        </p>

                        <p className="flex items-center gap-2 text-gray-400 text-sm">
                            Made with
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            by
                            <span className="text-white font-semibold">
                                Payel
                            </span>
                        </p>

                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;