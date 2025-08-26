import { Skeleton } from "../../components/ui/skeleton";

const ChaptersSkeleton = () => {
  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:items-center">
          <Skeleton className="h-8 w-48 rounded-md" /> {/* Title */}
          <Skeleton className="h-10 w-40 rounded-lg" />{" "}
          {/* CreateChapters Btn */}
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
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
              <tr key={i} className="hover:bg-muted transition-colors">
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
