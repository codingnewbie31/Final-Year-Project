import { Save, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const EditProfileDetails = ({
  formData,
  handleImageChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
}) => {
  return (
  <DashboardLayout activeMenu="company-profile">
    {formData && (
      <div className="mx-auto max-w-4xl p-4 sm:p-8">
        
        {/* Main Form Combined Container Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          
          {/* Solid Header Banner (Matches Blue Theme from image_31a71f.png) */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-6 sm:px-8">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Edit Profile
            </h1>
          </div>

          {/* Form Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Two-Column Form Field Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* ================= LEFT COLUMN: PERSONAL INFO ================= */}
              <div className="space-y-5">
                {/* Section Header with the line from image_31a71f.png */}
                <div className="relative pb-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Personal Information
                  </h2>
                  {/* The dark horizontal line under section text */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-700" />
                </div>

                {/* Avatar Upload Custom Row */}
                <div className="flex items-center gap-4 py-1">
                  <div className="relative shrink-0">
                    {formData?.avatar ? (
                      <img
                        src={formData?.avatar}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400">
                        Avatar
                      </div>
                    )}
                    {uploading?.avatar && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                  
                  {/* Styled File Upload Interface Element */}
                  <div>
                    <label className="relative flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100/50">
                        Choose file
                      </span>
                      <span className="text-xs text-gray-400 font-medium truncate max-w-30">
                        No file chosen
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading?.avatar}
                        onChange={(e) => handleImageChange(e, "avatar")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100/80 transition-all"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400 outline-hidden cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ================= RIGHT COLUMN: COMPANY INFO ================= */}
              <div className="space-y-5">
                {/* Section Header with the line from image_31a71f.png */}
                <div className="relative pb-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Company Information
                  </h2>
                  {/* The dark horizontal line under section text */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-700" />
                </div>

                {/* Company Logo Upload */}
                <div className="flex items-center gap-4 py-1">
                  <div className="relative shrink-0">
                    {formData.companyLogo ? (
                      <img
                        src={formData.companyLogo}
                        alt="Company Logo"
                        className="h-20 w-20 rounded-2xl object-contain bg-gray-50 p-2 border border-gray-100"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400">
                        Logo
                      </div>
                    )}
                    {uploading.logo && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                  
                  {/* Styled Emerald/Green File Picker Element */}
                  <div>
                    <label className="relative flex items-center gap-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-100/50">
                        Choose file
                      </span>
                      <span className="text-xs text-gray-400 font-medium truncate max-w-30">
                        No file chosen
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading.logo}
                        onChange={(e) => handleImageChange(e, "logo")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100/80 transition-all"
                  />
                </div>

                {/* Company Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Company Description
                  </label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                    rows={3}
                    placeholder="Describe your company..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100/80 transition-all resize-none min-h-27"
                  />
                </div>
              </div>

            </div>

            {/* ================= ACTION BUTTONS FOOTER BLOCK ================= */}
            {/* The distinct solid horizontal line separating the content and the buttons layout from image_31a6a4.png */}
            <div className="pt-6 border-t-[1.5px] border-gray-900/95 flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-500" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading.avatar || uploading.logo}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:from-indigo-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer min-w-36 transform active:scale-[0.99]"
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
    )}
  </DashboardLayout>
);
};

export default EditProfileDetails;
