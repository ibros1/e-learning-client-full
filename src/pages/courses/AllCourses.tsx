import { useDispatch, useSelector } from "react-redux";
import CourseCard from "./CourseCard";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { listCoursesFn } from "../../store/slices/courses/listCourse";

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.listCoursesSlice);
  const courses = data?.courses || [];

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(listCoursesFn());
  }, [dispatch]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=" bg-white w-screen xl:w-full dark:bg-[#091025] transition-colors duration-300">
      <div className="px-4 py-4 xl:px-8 xl:py-8">
        {/* Heading and Filters */}
        <div className="">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Courses
              </h1>
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Search Courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 rounded w-52"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-8 pb-4">
            <div className="">
              <h1 className="  text-gray-600 dark:text-gray-400">
                {filteredCourses.length} Courses
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <select className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
                <option>Alphabetical</option>
                <option>Newest</option>
              </select>

              <select className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
                <option>All Categories</option>
                <option>Design</option>
                <option>Business</option>
              </select>

              <select className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 px-3 py-2 rounded">
                <option>All Instructors</option>
                {courses.map((c) => (
                  <option key={c.id}>{c.users.full_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course}></CourseCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
