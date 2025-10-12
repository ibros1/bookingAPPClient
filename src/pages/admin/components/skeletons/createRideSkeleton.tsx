"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateRideSkeleton = () => {
  return (
    <div className="w-screen lg:w-full flex justify-center items-center py-10 px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Ride</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 animate-pulse">
          {/* User ID */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Route ID */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Fare USD */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Fare SLSH */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Button */}
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRideSkeleton;
