import { Briefcase } from "lucide-react";

const LoadingSpinner= () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

      {/* Rotating Blue Ring */}
      <div className="relative flex items-center justify-center w-20 h-20">

        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>

        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>

        {/* Briefcase Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
          <Briefcase
            size={27}
            className="text-blue-600"
            strokeWidth={2}
          />
        </div>

      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Finding amazing job opportunities
          <span className="animate-pulse">...</span>
        </h2>
      </div>

    </div>
  );
};

export default LoadingSpinner;