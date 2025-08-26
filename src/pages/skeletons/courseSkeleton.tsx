import { Skeleton } from "../../components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="bg-white h-full dark:bg-[#091025] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative">
        <Skeleton className="w-full h-48" />
        <span className="absolute top-2 left-2">
          <Skeleton className="h-5 w-24 rounded" />
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <Skeleton className="h-4 w-20 mb-2" /> {/* Chapters */}
        <Skeleton className="h-6 w-3/4 mb-3" /> {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-full mb-2" /> {/* Desc line 1 */}
        <Skeleton className="h-4 w-5/6 mb-4" /> {/* Desc line 2 */}
        <div className="mt-auto">
          <Skeleton className="h-6 w-16 mb-3 ml-auto" /> {/* Price */}
          <Skeleton className="h-9 w-full rounded-lg" /> {/* Button */}
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
