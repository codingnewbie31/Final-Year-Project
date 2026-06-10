import { ArrowLeft, Bookmark, Grid, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedJobList, setSavedJobList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const getSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      setSavedJobList(response.data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handelUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job removed successfully!");
      getSavedJobs();
    } catch (err) {
      toast.error("Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, [user]);

  return (
    <div className="scroll-smooth bg-gray-50 min-h-screen">
      <Navbar />

      <div className="mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-linear-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:border-transparent active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-white transform group-hover:-translate-x-1 transition-all duration-200" />
                <span>Back</span>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                Saved Jobs
              </h1>
            </div>

            {/* View Mode Toggles */}
            {savedJobList.length > 0 && (
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-xs">
                <button
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
            )}
          </div>

          {/* Job Count Badge */}
          {savedJobList.length > 0 && (
            <p className="text-sm font-medium text-gray-600">
              Showing
              <span className="mx-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-0.5 text-base font-bold text-gray-900 shadow-xs">
                {savedJobList.length}
              </span>
              saved {savedJobList.length === 1 ? "job" : "jobs"}
            </p>
          )}

          {/* Empty State */}
          {savedJobList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xs px-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-4">
                <Bookmark className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No saved jobs yet
              </h3>
              <p className="mt-1.5 text-sm text-gray-500 max-w-xs leading-relaxed">
                Start saving jobs that interest you to view them later.
              </p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="mt-5 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-150"
              >
                Browse Jobs
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
              {savedJobList.map((savedJob) => (
                <JobCard
                  key={savedJob._id}
                  job={savedJob?.job}
                  onClick={() => navigate(`/job/${savedJob?.job._id}`)}
                  onToggleSave={() => handelUnsaveJob(savedJob?.job._id)}
                  saved
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;