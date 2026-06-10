import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
          <span>
            {applicant.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {time}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
