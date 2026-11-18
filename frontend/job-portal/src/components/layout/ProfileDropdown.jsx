import { ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  Name,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100 transition-all duration-200"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 font-semibold text-lg">
              {Name?.charAt(0).toUpperCase() || "E"}
            </span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-800">
            {Name.toUpperCase() || "name"}
          </p>
          <p className="text-xs text-gray-500">Employer</p>
        </div>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          
          {/* Profile Information */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold text-lg">
                    {Name?.charAt(0).toUpperCase() || "E"}
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {Name.toUpperCase() || "name"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {email}
                </p>
              </div>
            </div>

            <span className="inline-block mt-3 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              Verified Account
            </span>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;