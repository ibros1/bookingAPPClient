"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AllRoutesSkeleton: React.FC = () => {
  return (
    <div className="p-6 w-screen lg:w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-72 rounded-md" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Search Box */}
      <Skeleton className="h-10 w-full sm:w-64 rounded-md" />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="w-full space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 w-full animate-pulse"
              >
                <Skeleton className="h-6 w-6 rounded-full" /> {/* Checkbox */}
                <Skeleton className="h-6 w-32 rounded-md" /> {/* From */}
                <Skeleton className="h-6 w-32 rounded-md" /> {/* End */}
                <Skeleton className="h-6 w-40 rounded-md" />{" "}
                {/* Last Updated */}
                <Skeleton className="h-6 w-20 rounded-md" /> {/* Actions */}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllRoutesSkeleton;
