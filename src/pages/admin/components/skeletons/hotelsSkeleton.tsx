"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ListHotelsSkeleton: React.FC = () => {
  return (
    <div className="w-full p-6 dark:bg-gray-900 dark:text-white animate-pulse">
      {/* Title */}
      <div className="mb-6 h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <CardTitle>
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </CardTitle>
            <CardContent>
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 p-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
        <div className="sm:w-64 mt-2 sm:mt-0 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                {[...Array(7)].map((_, idx) => (
                  <th key={idx} className="p-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, idx) => (
                <tr key={idx}>
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="p-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4 flex-wrap">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListHotelsSkeleton;
