// components/SettingsPageSkeleton.tsx
import React from "react";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={`bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse ${className}`}
  />
);

const SettingsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar Skeleton */}
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center md:w-80">
          <SkeletonBlock className="w-full h-28 rounded-xl mb-16" />
          <SkeletonBlock className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 -mt-16 shadow-md" />
          <div className="mt-4 w-full text-center">
            <SkeletonBlock className="h-6 w-3/4 mx-auto mb-2" />
            <SkeletonBlock className="h-4 w-1/2 mx-auto" />
          </div>
          <div className="flex gap-8 mt-6 text-center text-sm font-medium w-full justify-center">
            <SkeletonBlock className="h-6 w-10" />
            <SkeletonBlock className="h-6 w-10" />
          </div>
          <SkeletonBlock className="mt-2 h-4 w-3/4" />
          <SkeletonBlock className="mt-6 h-10 w-full rounded-full" />
        </aside>

        {/* Settings Content Skeleton */}
        <div className="flex-1 max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-10">
          <SkeletonBlock className="h-10 w-1/2 mb-4" /> {/* Account Settings */}
          {/* Profile Section */}
          <section className="space-y-4">
            <SkeletonBlock className="h-6 w-1/3" />
            <div className="grid sm:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-10 w-full" />
                ))}
            </div>
          </section>
          {/* Preferences Section */}
          <section className="space-y-4">
            <SkeletonBlock className="h-6 w-1/3" />
            <div className="space-y-4">
              {Array(2)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <SkeletonBlock className="h-6 w-40" />
                    <SkeletonBlock className="h-6 w-14 rounded-full" />
                  </div>
                ))}
            </div>
          </section>
          {/* Security Section */}
          <section className="space-y-4">
            <SkeletonBlock className="h-6 w-1/3" />
            <div className="grid sm:grid-cols-2 gap-6">
              {Array(2)
                .fill(0)
                .map((_, idx) => (
                  <SkeletonBlock key={idx} className="h-10 w-full" />
                ))}
            </div>
            <SkeletonBlock className="mt-6 h-10 w-32 rounded-lg" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPageSkeleton;
