import { useEffect, useState } from "react";
import { Save, X, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/Layout/Navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";
      handleInputChange(type, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl);
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  const DeleteResume = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: user.resume || "",
      });
      if (response.status === 200) {
        toast.success("Resume deleted successfully!");
        setProfileData({ ...formData, resume: "" });
        updateUser({ ...formData, resume: "" });
      }
    } catch (error) {
      console.error("Resume delete failed:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      resume: user?.resume || "",
    };
    setProfileData({ ...userData });
    setFormData({ ...userData });
  }, [user]);

  return (
    <div className="scroll-smooth bg-gray-50 min-h-screen">
      <Navbar />

      <div className="mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-6">
              <h1 className="text-xl font-bold text-white tracking-tight">
                My Profile
              </h1>
              <p className="text-sm text-indigo-100 mt-0.5">
                Manage your personal information
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  {formData?.avatar ? (
                    <img
                      src={formData?.avatar}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-400">
                        {formData?.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  {uploading?.avatar && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">
                    Profile Photo
                  </p>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span className="inline-flex items-center justify-center rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100">
                      Choose photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "avatar")}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1.5">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>

              {/* Resume */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Resume
                </label>
                {formData?.resume ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <a
                      href={formData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate max-w-xs transition-colors"
                    >
                      View Current Resume
                    </a>
                    <button
                      onClick={DeleteResume}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-400">
                      {/* Simple document icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      No resume uploaded yet
                    </p>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center justify-center rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100">
                        Upload Resume
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleImageChange(e, "resume")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-600" />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  to="/find-jobs"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar || uploading.logo}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all duration-200 min-w-36"
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
