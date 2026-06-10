import {
  MapPin,
  ArrowLeft,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES, SALARY_PERIODS } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();
  const currencies = [{ value: "usd", label: "$" }];

  // Safely find the corresponding salary period label from central utility configurations
  const getSalaryPeriodLabel = (periodValue) => {
    const periodObj = SALARY_PERIODS?.find((p) => p.value === periodValue);
    if (periodObj) return periodObj.label;
    
    // Safety fallback just in case the value is blank or unmapped
    const fallbacks = {
      hourly: "per hour",
      monthly: "per month",
      yearly: "per year"
    };
    return fallbacks[periodValue] || "per year";
  };

  // Safe checks for empty salary metrics
  const hasSalaryInfo = formData.salaryMin || formData.salaryMax;
  const currencySymbol = currencies.find((c) => c.value === formData.currency)?.label || "$";

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 transition-all duration-300">
        
        {}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Job Preview</h2>
          <button
            onClick={() => setIsPreview(false)}
            className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-105 active:scale-95 group"
          >
            <ArrowLeft
              size={18}
              className="text-gray-400 group-hover:text-white transition-colors"
            />
            Back to Edit
          </button>
        </div>

        {}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {formData.jobTitle || "Job Title"}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <MapPin size={18} className="text-gray-400" />
              <span>
                {formData.isRemote ? "Remote" : formData.location || "Location"}
              </span>
            </div>

            {/* Badges metadata list mapping */}
            <div className="flex items-center gap-3 pt-2">
              <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold transition-transform hover:scale-110">
                {CATEGORIES.find((c) => c.value === formData.category)?.label ||
                  "Category"}
              </span>
              <span className="px-5 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-bold transition-transform hover:scale-110">
                {JOB_TYPES.find((j) => j.value === formData.jobType)?.label ||
                  "Job Type"}
              </span>
              <div className="flex items-center gap-2 text-gray-400 ml-2">
                <Clock size={16} />
                <span className="text-xs font-semibold">Posted today</span>
              </div>
            </div>
          </div>

          {/* Company Brand Logo Preview container */}
          <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm transition-transform hover:rotate-3">
            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt="Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <Building2 size={40} className="text-gray-300" />
            )}
          </div>
        </div>

        {}
        <div className="relative overflow-hidden bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 transition-all hover:bg-emerald-50 mb-10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200 shrink-0">
                <DollarSign className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Compensation
                </h3>
                {hasSalaryInfo ? (
                  <div className="text-xl font-black text-gray-900 flex items-center gap-1 flex-wrap">
                    {formData.salaryMin ? `${currencySymbol}${Number(formData.salaryMin).toLocaleString()}` : ""}
                    {formData.salaryMin && formData.salaryMax ? " - " : ""}
                    {formData.salaryMax ? `${currencySymbol}${Number(formData.salaryMax).toLocaleString()}` : ""}
                    <span className="text-sm text-gray-500 font-medium ml-2">
                      {getSalaryPeriodLabel(formData.salaryPeriod)}
                    </span>
                  </div>
                ) : (
                  <div className="text-xl font-black text-gray-900">
                    Competitive Salary
                  </div>
                )}
              </div>
            </div>

            {/* Custom dynamic label block indicating salary validation status */}
            <div className="self-start sm:self-auto bg-emerald-100/50 px-4 py-2 rounded-lg flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Briefcase size={16} />
              <span>{hasSalaryInfo ? "Paid Position" : "Competitive"}</span>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-10">
          {/* Job Description Text block */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-base md:text-lg">About This Role</span>
            </h3>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.description || "No description provided."}
              </div>
            </div>
          </div>

          {/* Requirements List container block */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-base md:text-lg">
                What We're Looking For
              </span>
            </h3>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-gray-100 rounded-xl p-6">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.requirements || "No requirements specified."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
