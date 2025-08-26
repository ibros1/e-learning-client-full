import { Skeleton } from "../../components/ui/skeleton";

const AdminCoursesSkeleton = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Info Cards / Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-4 md:p-6 flex items-center gap-3"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-16 h-6 mb-2" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mb-6">
        <Skeleton className="w-full md:max-w-lg h-10 rounded-lg" />
        <div className="flex gap-2 w-full md:w-auto">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-8 rounded-full" />
          ))}
          <Skeleton className="w-32 h-10 rounded-lg ml-auto md:ml-0" />
        </div>
      </div>

      {/* Courses Table Skeleton */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[...Array(7)].map((_, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                >
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {[...Array(7)].map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-5 w-full max-w-[100px]" />
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
export default AdminCoursesSkeleton;
