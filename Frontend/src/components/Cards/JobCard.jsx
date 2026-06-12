import {
  Bookmark,
  Building,
  Building2,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
  const { user } = useAuth();

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      return `${num}`;
    };
    return `$${formatNumber(min)}/m`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Card Top Section */}
      <div className="p-5 flex items-start justify-between gap-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {job?.company?.companyLogo ? (
            <img
              src={job?.company?.companyLogo}
              alt="Company Logo"
              className="h-12 w-12 rounded-xl object-contain bg-gray-50 p-1.5 border border-gray-100 shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-indigo-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {job?.title}
            </h3>
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 truncate">
              <Building className="h-3.5 w-3.5 shrink-0" />
              {job?.company?.companyName}
            </p>
          </div>
        </div>

        {/* Bookmark */}
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="shrink-0 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 transition-colors ${
                job?.isSaved || saved
                  ? "text-indigo-600 fill-indigo-600"
                  : "text-gray-400 hover:text-indigo-600"
              }`}
            />
          </button>
        )}
      </div>

      {/* Tags Row */}
      <div className="px-5 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
          <MapPin className="h-3 w-3" />
          {job?.location}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
            job?.type === "Full-Time"
              ? "bg-green-50 text-green-700 border border-green-100"
              : job?.type === "Part-Time"
                ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                : job?.type === "Contract"
                  ? "bg-purple-50 text-purple-700 border border-purple-100"
                  : "bg-blue-50 text-blue-700 border border-blue-100"
          }`}
        >
          {job?.type}
        </span>
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
          {job?.category}
        </span>
      </div>

      {/* Bottom Row */}
      <div className="px-5 py-4 mt-3 border-t border-gray-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Salary */}
          <span className="text-sm font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {formatSalary(job?.salaryMin, job?.salaryMax)}
          </span>

          {/* Date */}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {job?.createdAt
              ? moment(job.createdAt).format("Do MMM YYYY")
              : "N/A"}
          </span>
        </div>

        {/* Applicant Count */}
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Users className="h-3.5 w-3.5" />
          {job?.applicantCount || 0} applied
        </span>

        {/* Action */}
        {!saved && (
          <>
            {job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              !hideApply && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-sm transition-all duration-150 active:scale-95"
                >
                  Apply Now
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
