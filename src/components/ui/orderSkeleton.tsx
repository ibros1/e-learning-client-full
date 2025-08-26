// MyOrderSkeleton.tsx
"use client";

import { Skeleton } from "./skeleton"; // your pulsing div wrapper

const MyOrderSkeleton = () => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-[#091025] min-h-screen space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Orders Skeleton List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {/* Top row */}
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>

            {/* Price & status */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        <Skeleton className="h-4 w-32 mx-auto rounded" />
      </div>
    </div>
  );
};

export default MyOrderSkeleton;
