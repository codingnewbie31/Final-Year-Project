import { useState } from "react";

const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || "");

  return (
    <div className="space-y-3 pt-1">
      {/* Min & Max Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Min Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Min
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              min="0"
              step="1000"
              className="w-full pl-7 pr-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              value={minSalary}
              onChange={({ target }) => setMinSalary(target.value)}
              onBlur={() =>
                handleFilterChange(
                  "minSalary",
                  minSalary ? parseInt(minSalary) : ""
                )
              }
            />
          </div>
        </div>

        {/* Max Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Max
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="Any"
              min="0"
              step="1000"
              className="w-full pl-7 pr-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              value={maxSalary}
              onChange={({ target }) => setMaxSalary(target.value)}
              onBlur={() =>
                handleFilterChange(
                  "maxSalary",
                  maxSalary ? parseInt(maxSalary) : ""
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Active Range Display */}
      {(minSalary || maxSalary) && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
          <span className="text-xs font-semibold text-indigo-600">
            {minSalary ? `$${Number(minSalary).toLocaleString()}` : "$0"}
          </span>
          <span className="text-xs text-indigo-400">→</span>
          <span className="text-xs font-semibold text-indigo-600">
            {maxSalary ? `$${Number(maxSalary).toLocaleString()}` : "No limit"}
          </span>
        </div>
      )}
    </div>
  );
};

export default SalaryRangeSlider;