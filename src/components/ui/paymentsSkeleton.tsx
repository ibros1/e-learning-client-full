"use client";

export const PaymentsSkeleton = () => {
  return (
    <div className="p-6 min-h-screen dark:bg-[#091025] space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl bg-gray-200 dark:bg-[#0f172a] shadow-lg animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="p-3 rounded-lg bg-gray-300 dark:bg-gray-700 w-10 h-10"></div>
            </div>
            <div className="mt-4 space-y-2">
              {Array.from({ length: 3 }).map((_, mIdx) => (
                <div key={mIdx} className="flex justify-between items-center">
                  <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search Input Skeleton */}
      <div className="w-full max-w-lg h-10 rounded-md bg-gray-200 dark:bg-[#0f172a] animate-pulse mb-6"></div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-[#0f172a]">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {Array.from({ length: 10 }).map((_, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx % 2 === 0
                    ? "bg-white dark:bg-[#0f172a]"
                    : "bg-gray-50 dark:bg-[#132033]"
                }
              >
                {Array.from({ length: 10 }).map((_, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* No data / loading placeholder */}
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <div className="h-4 w-1/3 mx-auto bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
