import { useState, useEffect, useRef } from "react";
import { Briefcase, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Focus the pointer specifically on the profile container element
  const profileContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the specific user dropdown container, slam it shut!
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      {/* Centered Width Constraint Wrapper */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/find-jobs"
            className="group flex items-center gap-2.5 font-bold text-gray-900 transition duration-150 text-lg tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-xs group-hover:scale-102 transition duration-200">
              <Briefcase className="h-4 w-4" />
            </div>
            <span>
              JobPortal
            </span>
          </Link>

          {/* Action Controls & Authentication Interface Block */}
          <div className="flex items-center gap-4">
            {/* Bookmark Action Button */}
            {user && (
              <button
                type="button"
                onClick={() => navigate("/saved-jobs")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            )}

            {/* Conditional Dropdown or Login Controls wrapper */}
            {isAuthenticated ? (
              /* We place the navbarRef right here on the user container. */
              <div ref={profileContainerRef} className="relative">
                <ProfileDropdown
                  isOpen={profileDropdownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  avatar={user?.avatar || ""}
                  companyName={user?.name || ""}
                  email={user?.email || ""}
                  userRole={user?.role || ""}
                  onLogout={logout}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-800 active:bg-gray-950 transition-all duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
