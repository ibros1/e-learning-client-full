"use client";

export const UsersAdminsSkeleton = () => {
  return (
    <div className="p-6 min-h-screen dark:bg-[#091025] space-y-8">
      <h2 className="h-8 w-1/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-6"></h2>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-gray-200 dark:bg-gray-800 shadow-sm animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {Array.from({ length: 12 }).map((_, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx % 2 === 0
                    ? "bg-white dark:bg-[#0f172a]"
                    : "bg-gray-50 dark:bg-[#132033]"
                }
              >
                {Array.from({ length: 12 }).map((_, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center py-6">
          <div className="h-4 w-1/3 mx-auto bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UsersAdminsSkeleton;
