import { Skeleton } from "../../components/ui/skeleton";

const ChaptersSkeleton = () => {
  return (
    <div className="p-6 dark:bg-[#0a1125] min-h-screen text-gray-900 dark:text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/20 dark:bg-white/5">
            <Skeleton className="h-6 w-32 mb-2 rounded-md" /> {/* Title */}
            <Skeleton className="h-8 w-16 mb-2 rounded-full" /> {/* Icon */}
            <Skeleton className="h-6 w-16 mb-1 rounded-md" /> {/* Value */}
            <Skeleton className="h-2 w-full rounded-md" /> {/* Progress */}
            <Skeleton className="h-3 w-24 mt-1 rounded-md" /> {/* Small text */}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64 rounded-md" /> {/* Title */}
          <Skeleton className="h-4 w-40 rounded-md" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" /> {/* CreateChapters Btn */}
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Skeleton className="h-12 w-full max-w-md rounded-xl" /> {/* Search */}
        <Skeleton className="h-10 w-32 rounded-lg" /> {/* Filter Btn */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted/50">
            <tr className="text-sm font-semibold text-muted-foreground uppercase">
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-4 py-3 whitespace-nowrap">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                {[...Array(7)].map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    {j === 6 ? (
                      <div className="flex gap-2 justify-center">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    ) : (
                      <Skeleton className="h-5 w-24" />
                    )}
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

export default ChaptersSkeleton;
