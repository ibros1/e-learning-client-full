import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <h1 className="text-8xl font-extrabold text-red-500">403</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Access Denied</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        You don’t have permission to view this page. Please contact an
        administrator if you believe this is an error.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
