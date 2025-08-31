export default function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen dark:bg-[#091025] bg-white py-10 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 animate-pulse">
        {/* Left: Course Info Skeleton */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 h-fit space-y-6">
          <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 flex gap-4 items-start">
            <div className="w-24 h-20 bg-gray-300 dark:bg-gray-700 rounded-xl" />
            <div className="space-y-3 flex-1">
              <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
              <div className="h-4 w-56 bg-gray-200 dark:bg-gray-600 rounded-md" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right: Payment Form Skeleton */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 space-y-6">
          {/* Title */}
          <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded-md" />

          {/* Total Plan */}
          <div className="flex items-center justify-between border rounded-xl p-3 bg-gray-50 dark:bg-gray-800">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md" />
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md" />
                </div>
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
            ))}
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded-md" />
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded-md" />
          </div>

          {/* Discount Input */}
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded-md" />
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded-md" />
          </div>

          {/* Instruction Box */}
          <div className="h-14 w-full bg-gray-200 dark:bg-gray-600 rounded-md" />

          {/* Button */}
          <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
