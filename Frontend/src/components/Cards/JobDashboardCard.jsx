import { Briefcase } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Briefcase className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{job.title}</h4>
          <p className="text-sm text-gray-500">
            {job.location} • {moment(job.createdAt)?.format("Do MMM YYYY")}
          </p>
        </div>
      </div>

      <div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            !job.isClosed
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.isClosed ? "Closed" : "Active"}
        </span>
      </div>
    </div>
  )
}

export default JobDashboardCard
