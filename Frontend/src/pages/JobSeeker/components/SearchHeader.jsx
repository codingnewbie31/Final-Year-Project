import React from "react";
import { MapPin, Search } from "lucide-react";

const SearchHeader = ({ filters, handleFilterChange }) => {
  return (
    <div className="w-full space-y-6 py-4">
      {/* Header Typography Section */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Find Your Dream Job
        </h1>
        <p className="mt-2 text-base text-gray-500 max-w-xl mx-auto px-4 sm:px-0">
          Discover opportunities that match your passion
        </p>
      </div>

      {/* Combined Search Bar Container */}
      <div className="w-full rounded-2xl bg-white p-3 shadow-sm hover:shadow-2xl border border-gray-200 transition-shadow duration-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Keyword Search Input Block */}
          <div className="flex flex-1 items-center gap-3 px-3 py-1">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Job title, company, or keywords"
              className="w-full bg-transparent text-sm text-gray-800 outline-hidden placeholder:text-gray-400 py-1.5"
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
            />
          </div>

          {/* Visual Divider line for desktop viewports */}
          <div className="hidden md:block h-6 w-px bg-gray-300" />

          {/* Location Search Input Block */}
          <div className="flex w-full md:w-64 items-center gap-3 px-3 py-1">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent text-sm text-gray-800 outline-hidden placeholder:text-gray-400 py-1.5"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>

          {/* Action Submit Button Block */}
          <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-blue-700 active:from-indigo-800 active:to-blue-800 transition-all duration-200 cursor-pointer whitespace-nowrap">
            Search Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
