import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  // Sample job data
  const [jobs, setJobs] = useState([]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "applicants") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSort = (field) => {};

  // Toggle the status of a job
  const handleStatusChange = async (jobId) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.JOBS.TOGGLE_CLOSE(jobId),
      );
      getPostedJobs(true);
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  // Delete a specific job
  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Decide which sort icon to display based on current sort field and direction
  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Loading state with animations
  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  const getPostedJobs = async (disableLoader) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOBS_EMPLOYER,
      );

      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data?.map((job) => ({
          id: job._id,
          title: job?.title,
          company: job?.company?.name,
          status: job?.isClosed ? "Closed" : "Active",
          applicants: job?.applicationCount || 0,
          datePosted: moment(job?.createdAt).format("DD-MM-YYYY"),
          logo: job?.company?.companyLogo,
        }));

        setJobs(formattedJobs);
      }
    } catch (error) {
      if (error.response) {
        // Handle API-specific errors
        console.error(error.response.data.message);
      } else {
        console.error("Error posting job. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJobs();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu='manage-jobs'>
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Job Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your job postings and track applications in real-time.
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-xl shadow-xs hover:shadow-md active:scale-98 transition-all duration-200 cursor-pointer"
              onClick={() => navigate("/post-job")}
            >
              <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
              Add New Job
            </button>
          </div>

          {/* Filters Wrapper */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xs border border-gray-200/60 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="sm:w-48 relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full appearance-none pl-4 pr-10 py-2.5 text-sm bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 cursor-pointer text-gray-700"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
                {/* Custom Chevron Icon */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Showing{" "}
              <span className="text-gray-700 font-semibold">
                {paginatedJobs.length}
              </span>{" "}
              of{" "}
              <span className="text-gray-700 font-semibold">
                {filteredAndSortedJobs.length}
              </span>{" "}
              jobs
            </p>
          </div>

          {/* Table */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
            {filteredAndSortedJobs.length === 0 && !isLoading ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                  <Search className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-gray-500 max-w-xs">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              /* Data Table Container */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th
                        className="py-4 px-6 cursor-pointer select-none hover:bg-gray-100/50 transition duration-150"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Job Title</span>
                          <SortIcon field="title" />
                        </div>
                      </th>
                      <th
                        className="py-4 px-6 cursor-pointer select-none hover:bg-gray-100/50 transition duration-150"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th
                        className="py-4 px-6 cursor-pointer select-none hover:bg-gray-100/50 transition duration-150"
                        onClick={() => handleSort("applicants")}
                      >
                        <div className="flex items-center gap-2">
                          <span>Applicants</span>
                          <SortIcon field="applicants" />
                        </div>
                      </th>
                      <th className="py-4 px-6 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <LoadingRow key={index} />
                        ))
                      : paginatedJobs.map((job) => (
                          <tr
                            key={job.id}
                            className="hover:bg-gray-50/60 transition duration-150 ease-in-out"
                          >
                            {/* 1. Job Title & Company Column */}
                            <td className="py-4 px-6 max-w-xs">
                              <div className="font-semibold text-gray-900 truncate">
                                {job.title}
                              </div>
                              <div className="text-xs text-gray-400 font-medium mt-0.5">
                                {job.company || "Alex William"}
                              </div>
                            </td>

                            {/* 2. Status Badge Column */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                                  job.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>

                            {/* 3. Applicants Count Action Button */}
                            <td className="py-4 px-6">
                              <button
                                onClick={() =>
                                  navigate("/applicants", {
                                    state: { jobId: job.id },
                                  })
                                }
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-xl transition duration-150"
                              >
                                <Users className="h-4 w-4" />
                                <span className="font-mono font-semibold">
                                  {job.applicants || 0}
                                </span>
                              </button>
                            </td>

                            {/* 4. Combined Action Controls Row */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2.5">
                                {/* Edit Icon Button */}
                                <button
                                  onClick={() =>
                                    navigate("/post-job", {
                                      state: { jobId: job.id },
                                    })
                                  }
                                  className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl transition duration-150"
                                  title="Edit Job"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>

                                {/* Status Conditional Switcher */}
                                {job.status === "Active" ? (
                                  <button
                                    onClick={() => handleStatusChange(job.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition duration-150"
                                    title="Close Job"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Close</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleStatusChange(job.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition duration-150"
                                    title="Activate Job"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Activate</span>
                                  </button>
                                )}

                                {/* Delete Icon Button */}
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition duration-150"
                                  title="Delete Job"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-4 shadow-xs">
              {/* 1. Mobile Layout View (Only visible on phones) */}
              <div className="flex-1 flex justify-between gap-3 sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 active:scale-98 disabled:scale-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 active:scale-98 disabled:scale-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                >
                  Next
                </button>
              </div>

              {/* 2. Desktop Layout View (Hidden on mobile) */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                {/* Dynamic Metric Text */}
                <div>
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredAndSortedJobs.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredAndSortedJobs.length}
                    </span>{" "}
                    results
                  </p>
                </div>

                {/* Page Selector Navigation Group */}
                <div>
                  <nav
                    className="inline-flex items-center gap-1.5"
                    aria-label="Pagination"
                  >
                    {/* Desktop Previous Action Button */}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 shadow-xs hover:bg-gray-50 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="w-5 h-5 stroke-2" />
                    </button>

                    {/* Numbered Page Links */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const isActive = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center justify-center min-w-10 h-9 px-3 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
                              isActive
                                ? "bg bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-xs active:scale-95"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}

                    {/* Desktop Next Action Button */}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 shadow-xs hover:bg-gray-50 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="w-5 h-5 stroke-2" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
