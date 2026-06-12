import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  Send,
  Clock,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES, SALARY_PERIODS } from "../../utils/data";
import toast from "react-hot-toast";
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextareaField from "../../components/Input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "yearly",
    isUrgent: false,
    shiftStartTime: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation check
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // 2. Prepare data payload
    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      salaryPeriod: formData.salaryPeriod,
      isUrgent: formData.isUrgent,
      shiftStartTime: formData.isUrgent ? formData.shiftStartTime : null,
    };

    try {
      // 3. API Call (Update or Create)
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? "Job Updated Successfully!" : "Job Posted Successfully!",
        );

        // Reset state
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
          salaryPeriod: "yearly",
        });

        navigate("/employer-dashboard");
        return;
      }

      console.error("Unexpected response:", response);
      toast.error("Something went wrong. Please try again.");
    } catch (error) {
      // 4. Error Handling implementation
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to post/update job. Please try again.");
      }
    } finally {
      // 5. Loading lifecycle cleanup
      setIsSubmitting(false);
    }
  };

  // Form Validation Helper
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.category) {
      errors.category = "Please select a category";
    }

    if (!formData.jobType) {
      errors.jobType = "Please select a job type";
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be greater than minimum salary";
    }

    if (formData.isUrgent && !formData.shiftStartTime) {
      errors.shiftStartTime = "Please set a shift start time for urgent jobs";
    }

    return errors;
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
          );
          const jobData = response.data;

          if (jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            });
          }
        } catch (error) {
          console.error("Error fetching job details");
          if (error.response) {
            console.error("API Error:", error.response.data.message);
          }
        }
      }
    };

    fetchJobDetails();

    // Optional cleanup function from tutorial
    return () => {
      // Reset or abort operations if needed
    };
  }, [jobId]);

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 sm:px-8 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Post a new job
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Fill out the form below to create your job posting
                  </p>
                </div>
              </div>

              {/* Preview Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-900 border border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg"
                >
                  <Eye className="w-4 h-4 transition-colors duration-300" />
                  Preview
                </button>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 sm:p-8 flex flex-col gap-8">
              {/* Section 1 — Basic info */}
              <div>
                <div className="flex flex-col gap-4">
                  <InputField
                    label="Job Title"
                    id="jobTitle"
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    error={errors.jobTitle}
                    required
                    icon={Briefcase}
                  />
                  <InputField
                    label="Location"
                    id="location"
                    placeholder="e.g., New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    error={errors.location}
                    icon={MapPin}
                  />
                </div>
              </div>

              {/* Section 2 — Job details */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    options={CATEGORIES}
                    placeholder="Select a category"
                    error={errors.category}
                    required
                    icon={Users}
                  />
                  <SelectField
                    label="Job Type"
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) =>
                      handleInputChange("jobType", e.target.value)
                    }
                    options={JOB_TYPES}
                    placeholder="Select job type"
                    error={errors.jobType}
                    required
                    icon={Briefcase}
                  />
                </div>
              </div>

              {/* Section 3 — Description & Requirements */}
              <div>
                <div className="flex flex-col gap-4">
                  <TextareaField
                    label="Job Description"
                    id="description"
                    placeholder="Describe the role and responsibilities..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    error={errors.description}
                    helperText="Include key responsibilities, day-to-day tasks, and what makes this role exciting."
                  />
                  <TextareaField
                    label="Requirements"
                    id="requirements"
                    placeholder="List key qualifications and skills..."
                    value={formData.requirements}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    error={errors.requirements}
                    helperText="Include required skills, experience level, education, and any preferred qualifications."
                  />
                </div>
              </div>

              {/* Section 4 — Compensation details layout */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Minimum Salary Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={formData.salaryMin}
                        onChange={(e) =>
                          handleInputChange("salaryMin", e.target.value)
                        }
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors text-sm"
                      />
                    </div>

                    {/* Maximum Salary Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={formData.salaryMax}
                        onChange={(e) =>
                          handleInputChange("salaryMax", e.target.value)
                        }
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors text-sm"
                      />
                    </div>

                    {/* Dynamic Salary Period */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Clock className="h-5 w-5" />
                      </div>
                      <select
                        value={formData.salaryPeriod}
                        onChange={(e) =>
                          handleInputChange("salaryPeriod", e.target.value)
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors text-sm bg-white appearance-none cursor-pointer text-gray-700 font-medium"
                      >
                        {SALARY_PERIODS &&
                          SALARY_PERIODS.map((period) => (
                            <option key={period.value} value={period.value}>
                              {period.label}
                            </option>
                          ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {errors.salary && (
                    <div className="mt-1.5 flex items-center gap-1 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Urgent Shift Toggle */}
              <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Mark as Urgent
                      </p>
                      <p className="text-xs text-gray-500">
                        Job seekers will see a countdown timer
                      </p>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("isUrgent", !formData.isUrgent)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                      formData.isUrgent ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                        formData.isUrgent ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Shift Start Time — only show when urgent is ON */}
                {formData.isUrgent && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shift Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.shiftStartTime}
                      onChange={(e) =>
                        handleInputChange("shiftStartTime", e.target.value)
                      }
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
                    />
                    {errors.shiftStartTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shiftStartTime}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publish job...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publish job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
