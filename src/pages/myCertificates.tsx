import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const MyCertificates: React.FC = () => {
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  if (!user)
    return <div className="">Please login first and enroll course</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <li
            className=" bb-icon-l bb-icon-certificate text-[44px]
"
          >
            {" "}
          </li>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          No Certificates Yet
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You haven’t earned any certificates yet. Complete courses to receive
          your achievements here.
        </p>

        {/* Call-to-action */}
        <button
          onClick={() => (window.location.href = "/courses")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition"
        >
          Browse Courses
        </button>
      </div>
    </div>
  );
};

export default MyCertificates;
