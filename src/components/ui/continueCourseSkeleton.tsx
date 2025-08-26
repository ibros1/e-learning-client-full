// ContinueCourseSkeleton.tsx
"use client";

import { Skeleton } from "./skeleton";

const ContinueCourseSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0c1425] dark:to-[#060a15]">
      {/* Main Content Skeleton */}
      <main className="flex-1 min-h-screen  p-4 max-w-4xl mx-auto space-y-8">
        {/* Lesson Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl" /> {/* Instructor */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48 rounded" /> {/* Lesson title */}
            <Skeleton className="h-4 w-32 rounded" /> {/* Instructor name */}
          </div>
        </div>

        {/* Lesson Description Skeleton */}
        <Skeleton className="h-6 w-1/2 rounded mt-4" />
        <Skeleton className="h-4 w-full rounded mt-2" />
        <Skeleton className="h-4 w-5/6 rounded mt-1" />
        <Skeleton className="h-4 w-4/6 rounded mt-1" />

        {/* Video Player Skeleton */}
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 mt-6">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="h-10 w-48 rounded-xl" />{" "}
          {/* Mark complete button */}
          <Skeleton className="h-10 w-32 rounded-xl" /> {/* Previous button */}
          <Skeleton className="h-10 w-32 rounded-xl" /> {/* Next button */}
        </div>

        {/* Course Progress Footer Skeleton */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700/50 mt-6">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      </main>
    </div>
  );
};

export default ContinueCourseSkeleton;
