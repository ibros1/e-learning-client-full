import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const PopularCourses = () => {
  const coursesState = useSelector((s: RootState) => s.listCoursesSlice);
  const courses = coursesState.data?.courses || [];
  // Search & filter state
  const [search] = useState<string>("");
  const [levelFilter] = useState<string>("all");
  const [priceFilter] = useState<string>("all");
  const [categoryFilter] = useState<string>("all");
  const navigateToCourse = (id: number) => {
    window.location.assign(`/courses/${id}`);
  };
  // Filter courses
  const filteredCourses = useMemo(() => {
    let list = courses.slice();
    if (search.trim()) {
      const lower = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(lower) ||
          c.description?.toLowerCase().includes(lower) ||
          (c.lesson ?? []).join(" ").toLowerCase().includes(lower)
      );
    }
    if (levelFilter !== "all") {
      list = list.filter((c) => (c.is_published || "beginner") === levelFilter);
    }
    if (priceFilter !== "all") {
      if (priceFilter === "free") list = list.filter((c) => !c.price);
      else list = list.filter((c) => !!c.price);
    }
    if (categoryFilter !== "all") {
      list = list.filter(
        (c) => (c.description || "General") === categoryFilter
      );
    }
    return list;
  }, [courses, search, levelFilter, priceFilter, categoryFilter]);
  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 dark:bg-[#091025]  mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
              Popular Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Browse our most popular courses loved by students
            </p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === "popular") {
                  filteredCourses.sort(
                    (a, b) =>
                      (a.enrollments?.length || 0) -
                      (b.enrollments?.length || 0)
                  );
                } else if (val === "new") {
                  filteredCourses.sort(
                    (a, b) =>
                      new Date(b.created_at || 0).getTime() -
                      new Date(a.created_at || 0).getTime()
                  );
                }
              }}
              className="rounded-lg border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-xs md:text-sm flex-1 sm:flex-none"
            >
              <option value="popular">Most popular</option>
              <option value="new">Newest</option>
              <option value="price">Price</option>
            </select>
            <button
              onClick={() => window.location.assign("/courses")}
              className="px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-xs md:text-sm"
            >
              View All
            </button>
          </div>
        </div>

        {coursesState.loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              Loading courses...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {courses.slice(0, 6).map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-lg md:rounded-xl shadow-sm hover:shadow-md overflow-hidden group cursor-pointer transition-all border border-gray-200 dark:border-gray-700"
                onClick={() => navigateToCourse(course.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${course.course_img}`}
                    alt={course.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white text-indigo-600 rounded-full text-xs font-medium">
                      {"Advanced"}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <h3 className="font-medium md:font-semibold text-base md:text-lg">
                      {course.title}
                    </h3>
                    {course.price ? (
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded text-xs md:text-sm font-medium">
                        ${course.price}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded text-xs md:text-sm font-medium">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-xs md:text-sm">4.5</span>
                      <span className="mx-1 md:mx-2 text-gray-400 text-xs">
                        •
                      </span>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {course.enrollments?.length || 0} students
                      </span>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1 group text-xs md:text-sm">
                      <span className="font-medium">View</span>
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PopularCourses;
