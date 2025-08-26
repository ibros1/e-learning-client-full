// CourseDetailPageSkeleton.tsx
"use client";

import { Skeleton } from "./skeleton";

const CourseDetailPageSkeleton = () => {
  return (
    <div className="bg-gray-50 dark:bg-[#091025] min-h-screen text-gray-800 dark:text-gray-200">
      {/* Floating Buttons */}
      <div className="fixed top-6 left-6 z-20">
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
      <div className="fixed top-6 right-6 z-20 flex gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* Banner */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0 h-[500px] bg-gray-200 dark:bg-gray-700">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Left Text Section */}
            <div className="max-w-3xl w-full space-y-6">
              <Skeleton className="h-6 w-60 rounded-lg" /> {/* rating */}
              <Skeleton className="h-10 w-96 rounded-lg" /> {/* title */}
              <Skeleton className="h-6 w-80 rounded-lg" /> {/* description */}
              <Skeleton className="h-6 w-72 rounded-lg" /> {/* description */}
              <div className="flex gap-3">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
            </div>

            {/* Pricing Card */}
            <div className="w-full md:w-80">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Skeleton className="h-[150px] w-full" /> {/* cover img */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" /> {/* button */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
        {/* Features */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 flex gap-6 px-6 py-4">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-6 w-28 rounded-lg" />
          </div>
          <div className="p-6 space-y-6">
            {/* Simulated Content Blocks */}
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPageSkeleton;
