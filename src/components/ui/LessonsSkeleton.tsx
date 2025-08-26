import { Skeleton } from "./skeleton"; // simple wrapper for pulsing div, or create inline

const LessonsSkeleton = () => {
  return (
    <div className="p-6 min-h-screen space-y-8 bg-white dark:bg-[#091025]">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      {/* Search Skeleton */}
      <div className="relative max-w-md">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr>
              {Array.from({ length: 10 }).map((_, idx) => (
                <th key={idx} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: 10 }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonsSkeleton;
