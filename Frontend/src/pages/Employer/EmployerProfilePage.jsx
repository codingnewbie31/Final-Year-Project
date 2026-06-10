import { useState, useEffect } from "react";
import { Building2, Mail, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import EditProfileDetails from "./EditProfileDetails";

import DashboardLayout from "../../components/layout/DashboardLayout";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";

      // Update form data with new image URL
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewUrl);

      // Upload image
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
        toast.success("Profile Details Updated Successfully!!");
        // Update profile data and exit edit mode
        setProfileData({ ...formData });
        updateUser({ ...formData });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  // Intercept browser back button in edit mode
  useEffect(() => {
    if (editMode) {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        handleCancel();
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [editMode]);

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      {/* Page Max Width Wrapper */}
      <div className="mx-auto max-w-4xl p-4 sm:p-8">
        {/* Main Combined Layout Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-shadow duration-200 hover:shadow-md">
          {/* Solid Header Banner */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-6 sm:px-8 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Employer Profile
            </h1>
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/20 active:bg-white/25 transition-all duration-200 cursor-pointer border border-white/10"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Content Body Block Container */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Grid Layout: Split Side-by-Side Personal Info & Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Block — Personal Information Component */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Personal Information
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  {/* Fully Circular Avatar */}
                  <div className="shrink-0">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100 shadow-xs"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-500 text-xl font-bold text-white ring-2 ring-gray-100">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {profileData.name || "Add Name"}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                      <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">{profileData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Block — Company Information Component */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Company Information
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  {/* Square Rounded Logo Container */}
                  <div className="shrink-0">
                    {profileData.companyLogo ? (
                      <img
                        src={profileData.companyLogo}
                        alt="Company Logo"
                        className="h-20 w-20 rounded-2xl object-contain bg-gray-50 p-2 border border-gray-100 shadow-xs"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-400">
                        <Building2 className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {profileData.companyName || "Add Company Name"}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                      <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">Company</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Block — Full Width About Company Component */}
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <h2 className="text-base font-bold text-gray-900">
                About Company
              </h2>
              <div className="rounded-2xl bg-gray-50/70 p-5 border border-gray-100/60 min-h-20">
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                  {profileData.companyDescription ||
                    "No company description provided yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
