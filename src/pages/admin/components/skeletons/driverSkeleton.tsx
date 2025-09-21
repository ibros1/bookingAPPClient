import React from "react";

const DriverSkeleton: React.FC = () => {
  return (
    <div className="p-6 animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>

      {/* Action Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
        <div className="flex gap-2">
          <div className="bg-slate-200 h-10 w-32 rounded"></div>
          <div className="bg-slate-200 h-10 w-36 rounded"></div>
          <div className="bg-slate-200 h-10 w-28 rounded"></div>
        </div>
        <div className="bg-slate-200 h-10 w-full sm:w-64 rounded mt-2 sm:mt-0"></div>
      </div>

      {/* Table Skeleton */}
      <div className="mt-6 overflow-x-auto">
        <div className="w-full border border-slate-200 rounded">
          {/* Table Header */}
          <div className="flex bg-slate-200 h-10">
            {[
              "",
              "Vehicle No",
              "Type",
              "Driver Name",
              "Driver Email",
              "Driver Phone",
              "Actions",
            ].map((col, idx) => (
              <div
                key={idx}
                className={`flex-1 h-10 border-r border-slate-200 px-2`}
              >
                {col && (
                  <div className="h-4 bg-slate-300 rounded w-3/4 mt-3"></div>
                )}
              </div>
            ))}
          </div>

          {/* Table Body */}
          {[...Array(6)].map((_, rowIdx) => (
            <div key={rowIdx} className="flex border-t border-slate-200 h-12">
              {[...Array(7)].map((_, colIdx) => (
                <div key={colIdx} className="flex-1 px-2 py-3">
                  <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-end gap-2 mt-4">
        <div className="bg-slate-200 h-10 w-20 rounded"></div>
        <div className="bg-slate-200 h-10 w-32 rounded"></div>
        <div className="bg-slate-200 h-10 w-20 rounded"></div>
      </div>
    </div>
  );
};

export default DriverSkeleton;
