import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Applied: "bg-gray-100 text-gray-800 border border-gray-200",
    Interview: "bg-amber-50 text-amber-800 border border-amber-200",
    Hired: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    Rejected: "bg-rose-50 text-rose-800 border border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize ${
        statusConfig[status] || "bg-gray-100 text-gray-800 border border-gray-200"
      }`}
    >
      {status || "Pending"}
    </span>
  );
};

export default StatusBadge;
