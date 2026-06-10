import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import moment from "moment";
import StatusBadge from "../../components/StatusBadge";
import toast from "react-hot-toast";


const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();

  const [jobDetails, setJobDetails] = useState(null);

  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        },
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const applyToJob = async () => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }

      getJobDetailsById();
    } catch (err) {
      console.log("Error:", err);
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (jobId && user) {
      getJobDetailsById();
    }
  }, [jobId, user]);

  return (
    <div className="scroll-smooth bg-gray-50 min-h-screen">
      <Navbar />

      <div className="mt-16">
        {jobDetails && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Top Banner */}
              <div className="bg-linear-to-br from-indigo-600 to-blue-600 px-6 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Company Logo */}
                  <div className="shrink-0">
                    {jobDetails?.company?.companyLogo ? (
                      <img
                        src={jobDetails?.company?.companyLogo}
                        alt="Company Logo"
                        className="h-16 w-16 rounded-2xl object-contain bg-white p-2 border border-white/20 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Title & Location */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      {jobDetails.title}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1.5 text-indigo-100">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">
                        {jobDetails.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags + Action Row */}
              <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {jobDetails.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-lg ${
                      jobDetails.type === "Full-Time"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : jobDetails.type === "Part-Time"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          : jobDetails.type === "Contract"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}
                  >
                    {jobDetails.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {jobDetails.createdAt
                        ? moment(jobDetails.createdAt).format("Do MMM YYYY")
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Apply Button or Status */}
                {jobDetails?.applicationStatus ? (
                  <StatusBadge status={jobDetails.applicationStatus} />
                ) : (
                  <button
                    onClick={applyToJob}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-sm transition-all duration-150 active:scale-95"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8">
              {/* Compensation Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-0.5">
                      Compensation
                    </h3>
                    <div className="text-lg font-bold text-gray-900">
                      ${jobDetails.salaryMin?.toLocaleString()} - $
                      {jobDetails.salaryMax?.toLocaleString()}
                      <span className="text-sm font-medium text-gray-500 ml-1.5">
                        per year
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-xl">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-600">
                    Competitive
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* About This Role */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
                  <div className="h-5 w-1 rounded-full bg-linear-to-b from-indigo-600 to-blue-600" />
                  <span>About This Role</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {jobDetails.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Requirements */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2.5 text-base font-bold text-gray-900">
                  <div className="h-5 w-1 rounded-full bg-linear-to-b from-indigo-600 to-blue-600" />
                  <span>What We're Looking For</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {jobDetails.requirements}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
