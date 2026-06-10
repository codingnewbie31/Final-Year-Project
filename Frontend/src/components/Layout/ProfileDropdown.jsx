import { ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
  userRole,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={onToggle}
        className="group flex items-center gap-2.5 p-2 pr-3 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-9 w-9 object-cover rounded-xl border border-gray-200 shrink-0"
          />
        ) : (
          <div className="h-9 w-9 bg-linear-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="font-semibold text-white text-sm">
              {companyName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name + Role */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {companyName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">
            {userRole}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

          {/* Profile Header */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-11 w-11 object-cover rounded-xl border border-gray-200 shrink-0"
                />
              ) : (
                <div className="h-11 w-11 bg-linear-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-semibold text-white">
                    {companyName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {companyName}
                </p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
                {/* ✅ Fixed: role badge */}
                <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() =>
                navigate(
                  user?.role === "jobseeker" ? "/profile" : "/company-profile"
                )
              }
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150 cursor-pointer"
            >
              <User className="w-4 h-4" />
              View Profile
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;