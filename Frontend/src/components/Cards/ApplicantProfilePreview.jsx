import { Download, X , ChevronDown } from "lucide-react";
import { useState } from "react";
import { getInitials } from "../../utils/helper";
import moment from "moment"; 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

import StatusBadge from "../StatusBadge";
const statusOptions = ["Applied", "In Review", "Rejected", "Accepted"];

const ApplicantProfilePreview = ({
  selectedApplicant,
  setSelectedApplicant,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status);
  const [loading, setLoading] = useState(false);

  const onChangeStatus = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id),
        { status: newStatus },
      );

      if (response.status === 200) {
        // Update local state after successful update
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
        toast.success("Application status updated successfully");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      // Optionally revert status if failed
      setCurrentStatus(selectedApplicant.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Applicant Profile</h3>
          <button
            onClick={() => handleClose()}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Container (Crucial for Mobile Screens) */}
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-6 pb-6 pt-6 space-y-5">
          {/* Profile Header Block */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">
              {selectedApplicant.applicant?.avatar ? (
                <img
                  src={selectedApplicant.applicant.avatar}
                  alt={selectedApplicant.applicant.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-blue-500 ring-4 ring-indigo-50">
                  <span className="text-2xl font-bold text-white uppercase tracking-wider">
                    {getInitials(selectedApplicant.applicant?.name)}
                  </span>
                </div>
              )}
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-0.5">
              {selectedApplicant.applicant?.name || "Unknown Candidate"}
            </h4>
            <p className="text-sm font-medium text-gray-500">
              {selectedApplicant.applicant?.email}
            </p>
          </div>

          {/* Info Blocks Block */}
          <div className="space-y-3 text-left">
            {/* Applied Position Card Block */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <h5 className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-2">
                Applied Position
              </h5>
              <p className="text-base font-bold text-gray-900">
                {selectedApplicant.job?.title}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedApplicant.job?.location} •{" "}
                {selectedApplicant.job?.type}
              </p>
            </div>

            {/* Application Details Card Block */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-3">
              <h5 className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                Application Details
              </h5>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-gray-600">Status:</span>
                <StatusBadge status={currentStatus} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applied Date:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {moment(selectedApplicant.createdAt)?.format("Do MMM YYYY")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Download Resume */}
          <button
            onClick={() =>
              handleDownloadResume(selectedApplicant.applicant?.resume)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </button>

          {/* Status Dropdown Controls */}
          <div className="pt-1 space-y-1.5 text-left">
            <label className="text-xs font-bold text-gray-500 pl-1">
              Change Application Status
            </label>
            <div className="relative">
              <select
                value={currentStatus}
                onChange={onChangeStatus}
                disabled={loading}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-2.5 text-sm text-gray-800 shadow-2xs outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-400 transition-all cursor-pointer"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow decorator */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {loading && (
              <p className="text-xs text-indigo-600 font-semibold animate-pulse pl-1">
                Updating status...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicantProfilePreview;
