import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, X } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import FilterContent from "./components/FilterContent";
import SearchHeader from "./components/SearchHeader";
import Navbar from "../../components/Layout/Navbar";
import JobCard from "../../components/Cards/JobCard";

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  // Sidebar collapse states
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  // Function to fetch jobs from API
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location)
        params.append("location", filterParams.location);
      if (filterParams.minSalary)
        params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary)
        params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.category)
        params.append("category", filterParams.category);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`,
      );

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly,
      };

      // Only call API if there are meaningful filters
      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" &&
          value !== false &&
          value !== null &&
          value !== undefined,
      );

      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs(); // Fetch all jobs if no filters
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  // Toggle save
  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully!");

        // Instantly update state locally so the layout doesn't flash
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isSaved: false } : job,
          ),
        );
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");

        // Instantly update state locally so the layout doesn't flash
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isSaved: true } : job,
          ),
        );
      }
    } catch (err) {
      console.error("Error toggling save job state:", err);
      toast.error("Something went wrong! Try again later");
    }
  };

  // Apply to job
  const applyToJob = async (jobId) => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");

        // Local state update: Mark this specific job as applied instantly
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, hasApplied: true } : job,
          ),
        );
      }
    } catch (err) {
      console.error("Error applying to job:", err);
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  const MobileFilterOverlay = () => (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        showMobileFilters ? "" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setShowMobileFilters(false)}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full pb-20 overscroll-contain">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );

  // Early return loading screen handler
  if (jobs.length === 0 && loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="scroll-smooth bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Search Banner */}
      {/* Hero Search Banner */}
      <div className="mt-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Main Page Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Layout Split Box */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Desktop Sidebar Filters Column */}
          <div className="hidden w-72 shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs lg:block sticky top-24">
            <div className="space-y-4">
              <h3 className="pl-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                Filter Jobs
              </h3>
              <FilterContent
                toggleSection={toggleSection}
                clearAllFilters={clearAllFilters}
                expandedSections={expandedSections}
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Listings Section */}
          <div className="flex-1 space-y-4">
            {/* Results Header Control Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-xs">
              <p className="text-sm font-medium text-gray-600">
                Showing
                <span className="mx-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-base font-bold text-gray-900">
                  {jobs.length}
                </span>
                available opportunities
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer lg:hidden"
                >
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span>Filters</span>
                </button>

                {/* View Mode Toggles */}
                <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-xs border border-indigo-500"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-xs border border-indigo-500"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xs px-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 max-w-xs leading-relaxed">
                  Try adjusting your search criteria or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-150"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onClick={() => navigate(`/job/${job._id}`)}
                    onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
                    onApply={() => applyToJob(job._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterOverlay />
    </div>
  );
};

export default JobSeekerDashboard;
