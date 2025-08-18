import type { Course } from "../../types/course";

import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { Button } from "../../components/ui/button";
import EnrolleCourse from "./enrollCourse";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const loginState = useSelector((state: RootState) => state.loginSlice);
  const user = loginState.data?.user;

  const isEnrolled = user
    ? course.enrollments?.some(
        (enrl) =>
          enrl.userId === user.id &&
          enrl.status === "COMPLETED" &&
          enrl.is_enrolled === true
      )
    : false;

  const handleNavigate = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      className="bg-white  h-full dark:bg-[#091025] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") handleNavigate();
      }}
    >
      <div className="relative">
        <img
          src={`${course.course_img}`}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {isEnrolled ? (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            Continue Course
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            NOT ENROLLED
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col h-full">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {course.chapters.length} Chapter
          {course.chapters.length !== 1 ? "s" : ""}
        </p>

        <h3 className="text-xl py-2 font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <img
            src={`${course.users.profilePhoto}`}
            alt="Instructor"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {course.users.full_name}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {course.description}
        </p>

        <div className="mt-auto text-right text-lg font-semibold text-blue-600 dark:text-blue-400">
          ${course.price}
        </div>

        {isEnrolled ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="mt-2"
          >
            Continue your Course
          </Button>
        ) : (
          <EnrolleCourse course={course} />
        )}
      </div>
    </div>
  );
};

export default CourseCard;
