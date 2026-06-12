import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract passed Job ID from routing state
  const jobId = location.state?.jobId || null;

  // --- State Hooks (Moved out of the nested function) ---
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- API Actions ---
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId),
      );
      setApplications(response.data);
    } catch (err) {

    } finally {
      setIsLoading(false);
    }
  };

  // --- Lifecycle Side Effects ---
  useEffect(() => {
    if (jobId) {
      fetchApplications();
    } else {
      navigate("/manage-jobs");
    }
  }, [jobId, navigate]);

  // --- Memoized Sorting Data Processing ---
  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) =>
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filtered.reduce((acc, app) => {
      const currentJobId = app.job?._id;
      if (!currentJobId) return acc;

      if (!acc[currentJobId]) {
        acc[currentJobId] = {
          job: app.job,
          applications: [],
        };
      }
      acc[currentJobId].applications.push(app);
      return acc;
    }, {});
  }, [applications, searchTerm]);

  // --- Event Handlers ---
  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    }
  };

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {isLoading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500 font-medium animate-pulse">
            Loading applications...
          </p>
        </div>
      ) : (
        /* Main Layout View Wrapper Container */
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header Component */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Side: Back Trigger & Page Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-linear-to-r hover:from-indigo-600 hover:to-blue-600 hover:text-white hover:border-transparent active:scale-95 transition-all duration-200 cursor-pointer"
                  title="Back to Job Management"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-500 group-hover:text-white transform group-hover:-translate-x-1 transition-all duration-200" />
                  <span>Back</span>
                </button>

                <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  Applications Overview
                </h1>
              </div>

              {/* Right Side: Optional placeholder */}
            </div>
          </div>
          {/* Main Content */}
          <div className="pb-8">
            {Object.keys(groupedApplications).length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white/60 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-xl shadow-black/5 px-4">
                <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  No applications available
                </h3>
                <p className="mt-1.5 text-sm text-gray-500 max-w-xs leading-relaxed">
                  There are no candidate submissions logged for this job listing
                  at the moment.
                </p>
              </div>
            ) : (
              /* Applications by Job List */
              <div className="space-y-8">
                {/* Applications by Job List */}
                <div className="space-y-8">
                  {Object.values(groupedApplications).map(
                    ({ job, applications }) => (
                      <div
                        key={job._id}
                        className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Left: Job Meta Data */}
                            <div>
                              <h2 className="text-lg font-bold tracking-tight text-white">
                                {job.title}
                              </h2>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-indigo-100/90 font-medium">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{job.category}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Metrics Application Badge */}
                            <div className="self-start sm:self-center">
                              <div className="bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10 text-sm font-semibold tracking-wide shadow-xs">
                                {applications.length}{" "}
                                {applications.length === 1
                                  ? "Application"
                                  : "Applications"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Applications List */}
                        <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100">
                          <div className="flex flex-col gap-4 w-full">
                            {applications.map((application) => (
                              <div
                                key={application._id}
                                className="w-full bg-white p-4 md:px-6 md:py-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row justify-between gap-4"
                              >
                                {/* Left — Avatar + Info */}
                                <div className="flex items-center gap-4 min-w-0">
                                  {application.applicant?.avatar ? (
                                    <img
                                      src={application.applicant.avatar}
                                      alt={application.applicant.name}
                                      className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                      {getInitials(application.applicant?.name)}
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <h3 className="text-base font-bold text-gray-900 truncate">
                                      {application.applicant?.name ||
                                        "Unknown Candidate"}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">
                                      {application.applicant?.email}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                                      <span>
                                        Applied{" "}
                                        {moment(application.createdAt)?.format(
                                          "Do MMM YYYY",
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right — Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 mt-2 md:mt-0 md:flex md:items-center md:gap-3 shrink-0 md:justify-end">
                                  <StatusBadge status={application.status} />

                                  <button
                                    onClick={() =>
                                      handleDownloadResume(
                                        application.applicant?.resume,
                                      )
                                    }
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-98 transition-all duration-150 cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Resume</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setSelectedApplicant(application)
                                    }
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 md:py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 rounded-xl active:scale-98 transition-all duration-150 cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>View Profile</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Modal */}
          {selectedApplicant && (
            <ApplicantProfilePreview
              selectedApplicant={selectedApplicant}
              setSelectedApplicant={setSelectedApplicant}
              handleDownloadResume={handleDownloadResume}
              handleClose={() => {
                setSelectedApplicant(null);
                fetchApplications();
              }}
            />
          )}
          
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;
