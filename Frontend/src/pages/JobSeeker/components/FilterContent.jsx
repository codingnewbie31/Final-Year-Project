import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../../utils/data";
import SalaryRangeSlider from "../../../components/Input/SalaryRangeSlider";

const FilterSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors"
    >
      {title}
      {isExpanded ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {isExpanded && children}
  </div>
);

const FilterContent = ({
  toggleSection,
  clearAllFilters,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  return (
    <div className="space-y-1">
      {/* Clear All Button */}
      <div className="flex justify-start pb-2">
        <button
          onClick={clearAllFilters}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Job Type Filter */}
      <FilterSection
        title="Job Type"
        isExpanded={expandedSections?.jobType}
        onToggle={() => toggleSection("jobType")}
      >
        <div className="space-y-2 pt-1">
          {JOB_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600 cursor-pointer"
                checked={filters?.type === type.value}
                onChange={(e) =>
                  handleFilterChange("type", e.target.checked ? type.value : "")
                }
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {type.value}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range Filter */}
      <FilterSection
        title="Salary Range"
        isExpanded={expandedSections?.salary}
        onToggle={() => toggleSection("salary")}
      >
        <SalaryRangeSlider
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections?.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="space-y-2 pt-1">
          {CATEGORIES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600 cursor-pointer"
                checked={filters?.category === type.value}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.checked ? type.value : "",
                  )
                }
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {type.value}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterContent;
