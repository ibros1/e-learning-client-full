// MyProfileSkeleton.tsx
"use client";

import { Skeleton } from "./skeleton";

const MyProfileSkeleton = () => {
  return (
    <div className="bg-white my-4 dark:bg-[#0F172A] rounded-md overflow-hidden shadow-sm mx-auto w-[98%] border dark:border-gray-700">
      {/* Cover Photo Skeleton */}
      <div className="relative w-full h-80">
        <Skeleton className="w-full h-full object-cover" />
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-60px]">
          {/* Avatar Skeleton */}
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white dark:bg-gray-800">
            <Skeleton className="w-full h-full rounded-full object-cover" />
          </div>
          {/* Active dot */}
          <Skeleton className="absolute bottom-[105px] right-[20px] w-4 h-4 rounded-full" />
        </div>
      </div>

      {/* Profile Info Skeleton */}
      <div className="pt-12 pb-6 text-center space-y-2">
        <Skeleton className="inline-block h-6 w-24 rounded-full" /> {/* Role */}
        <Skeleton className="h-8 w-48 mx-auto mt-2 rounded" /> {/* Name */}
        <Skeleton className="h-5 w-32 mx-auto rounded" /> {/* Username */}
        <div className="flex justify-center items-center gap-1 mt-1">
          <Skeleton className="h-4 w-36 rounded" /> {/* Joined date */}
          <Skeleton className="h-4 w-16 rounded ml-2" /> {/* Active status */}
        </div>
        {/* Edit Profile Button */}
        <div className="my-2 flex justify-center">
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        {/* Stats Skeleton */}
        <div className="flex justify-left gap-8 mt-4 p-4">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        {/* Tabs Skeleton */}
        <div className="flex justify-center gap-10 border-t border-gray-200 dark:border-gray-700 mt-8 pt-4">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>

      {/* Edit Profile Dialog Skeleton */}
      <div className="hidden">
        <Skeleton className="h-[80%] w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default MyProfileSkeleton;
