// MembersPageSkeleton.tsx
"use client";

import { Skeleton } from "./skeleton";

const MembersPageSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content Skeleton */}
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-64 rounded-lg" /> {/* Title */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 rounded-lg" /> {/* Filters button */}
            <Skeleton className="h-6 w-32 rounded-lg" /> {/* Count */}
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6"
            >
              {/* Top Section */}
              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-3">
                  <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full" />
                  <Skeleton className="absolute top-0 right-5 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                </div>

                {/* Role badge */}
                <Skeleton className="h-6 w-20 rounded-full mb-2" />

                {/* Name */}
                <Skeleton className="h-5 w-32 rounded mx-auto" />
                {/* Username */}
                <Skeleton className="h-4 w-24 rounded mx-auto mt-1" />
                {/* Joined date */}
                <Skeleton className="h-3 w-20 rounded mx-auto mt-2" />
              </div>

              {/* Footer Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-2 sm:gap-3 text-sm">
                <Skeleton className="w-full h-10 rounded-full" />
              </div>

              {/* View Profile */}
              <div className="border-t border-gray-200 dark:border-gray-700 text-center px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800">
                <Skeleton className="h-6 w-28 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Skeleton on the right */}
      <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 shadow-xl p-6 space-y-6">
        <Skeleton className="h-6 w-40 rounded" /> {/* Filter title */}
        <Skeleton className="h-10 w-full rounded-lg" /> {/* Search */}
        <Skeleton className="h-5 w-32 rounded" /> {/* Role */}
        <Skeleton className="h-5 w-32 rounded" /> {/* Status */}
        <Skeleton className="h-10 w-full rounded-lg" /> {/* Sort */}
        <Skeleton className="h-8 w-full rounded-lg" /> {/* Clear button */}
      </div>
    </div>
  );
};

export default MembersPageSkeleton;
