// src/pages/homePage/SectionSkeleton.tsx

export default function SectionSkeleton() {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl p-6 my-8 h-64">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-lg p-4 h-40"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
