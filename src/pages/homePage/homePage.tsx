// src/pages/homePage/homePage.tsx
import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  Award,
  BookOpenCheck,
  UserCheck,
} from "lucide-react";

import { listCoursesFn } from "../../store/slices/courses/listCourse";
import { getCompletedLessonsFn } from "../../store/lessonProggress/getCompletedProggress";

import type { AppDispatch, RootState } from "../../store/store";
import SectionSkeleton from "./ectionSkeleton";

// Lazy-loaded components
const Categories = lazy(() => import("./categories"));
const PopularCourses = lazy(() => import("./PopularCourses"));
const LearningPaths = lazy(() => import("./LearningPaths"));
const Trusted = lazy(() => import("./Trusted"));
const Testemonials = lazy(() => import("./Testemonials"));
const FAQ = lazy(() => import("./FAQ"));
const CTA = lazy(() => import("./CTA"));

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const coursesState = useSelector((s: RootState) => s.listCoursesSlice);
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  const userId = useSelector(
    (state: RootState) => state.loginSlice.data?.user?.id
  );
  const user = userState.data?.user;
  const enrollments = user?.enrollements;
  const courses = coursesState.data?.courses || [];
  const completedLessonsState = useSelector(
    (state: RootState) => state.getCompletedLessonsSlice
  );

  useEffect(() => {
    dispatch(listCoursesFn());
    if (userId) {
      dispatch(getCompletedLessonsFn(userId));
    }
  }, [dispatch, userId]);

  // Search & filter state
  const [search, setSearch] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // Stats counters
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [instructorsCount, setInstructorsCount] = useState<number>(0);
  const [completionRate, setCompletionRate] = useState<number>(0);

  useEffect(() => {
    const targetStudents = Math.max(
      1200,
      courses.reduce((acc: number, c) => acc + (c.enrollments?.length || 0), 0)
    );
    const targetCourses = Math.max(12, courses.length || 12);
    const targetInstructors = 24;
    const targetCompletion = 85;

    let s = 0,
      c = 0,
      i = 0,
      comp = 0;
    const dur = 900;
    const steps = 60;
    const si = Math.ceil((targetStudents - s) / steps);
    const ci = Math.ceil((targetCourses - c) / steps);
    const ii = Math.ceil((targetInstructors - i) / steps);
    const compi = Math.ceil((targetCompletion - comp) / steps);

    const interval = setInterval(() => {
      s = Math.min(targetStudents, s + si);
      c = Math.min(targetCourses, c + ci);
      i = Math.min(targetInstructors, i + ii);
      comp = Math.min(targetCompletion, comp + compi);
      setStudentsCount(s);
      setCoursesCount(c);
      setInstructorsCount(i);
      setCompletionRate(comp);
      if (
        s === targetStudents &&
        c === targetCourses &&
        i === targetInstructors &&
        comp === targetCompletion
      ) {
        clearInterval(interval);
      }
    }, Math.max(10, Math.floor(dur / steps)));
    return () => clearInterval(interval);
  }, [courses]);

  // Categories from courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.title || "General"));
    return ["All", ...Array.from(set)];
  }, [courses]);

  const navigateToCourse = (id: number) => {
    navigate(`/courses/${id}`);
  };

  const totalLessons = courses.map((course) => ({
    courseId: course.id,
    lessonsCount: course.lesson?.length || 18,
  }));

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="w-screen xl:w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0B1228] dark:via-[#091025] dark:to-[#050819] dark:text-gray-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 ">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center">
          <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                Learn{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  New Skills Online
                </span>
                , Anytime
              </h1>
              <p className="text-base sm:text-lg w-full text-indigo-700 dark:text-indigo-300">
                Access expert-led courses with flexible learning paths designed
                to help you grow your career and passions.
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full">
              <input
                id="course-search"
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-indigo-300 bg-white py-3 px-5 text-indigo-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#152036] dark:border-indigo-700 dark:text-indigo-100 transition"
              />
              {search.trim() && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-[#152036] rounded-lg shadow-lg max-h-60 overflow-y-auto border border-indigo-300 dark:border-indigo-700">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.slice(0, 6).map((course) => (
                      <button
                        key={course.id}
                        onClick={() => navigateToCourse(course.id)}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition text-sm sm:text-base truncate"
                      >
                        <span className="font-medium block text-indigo-900 dark:text-indigo-100 truncate">
                          {course.title}
                        </span>
                        <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-300 truncate">
                          {course.description}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-indigo-600 dark:text-indigo-300 font-medium text-sm sm:text-base">
                      No results found.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    levelFilter === lvl
                      ? "bg-indigo-700 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-[#12203e] dark:text-indigo-300 dark:hover:bg-[#1c2e57]"
                  }`}
                >
                  {lvl === "all"
                    ? "All Levels"
                    : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}

              {["all", "free", "paid"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    priceFilter === p
                      ? "bg-indigo-700 text-white shadow-md"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-[#12203e] dark:text-indigo-300 dark:hover:bg-[#1c2e57]"
                  }`}
                >
                  {p === "all"
                    ? "All Prices"
                    : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-full border border-indigo-300 py-2 px-3 sm:py-2.5 sm:px-4 bg-white dark:bg-[#0f1522] dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm min-w-[120px]"
              >
                {["All", ...categories.filter((c) => c !== "All")].map(
                  (cat) => (
                    <option key={cat} value={cat === "All" ? "all" : cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Action buttons */}
            <div className="xl:flex xs:flex-row  gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-indigo-700 text-white font-medium shadow-md hover:bg-indigo-800 transition text-sm sm:text-base"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-full border-2 border-indigo-700 text-indigo-700 font-medium shadow-sm hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-500 dark:hover:bg-indigo-900 transition text-sm sm:text-base"
              >
                Browse All Courses
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[40%] mt-6 sm:mt-8 lg:mt-0 flex justify-center">
            <div className="w-full max-w-md lg:max-w-none">
              <img
                src="/hero1.png"
                alt="Learning illustration"
                className="w-full h-auto rounded-lg "
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Section */}
      {enrollments && enrollments.length > 0 && (
        <section className="mx-auto px-4 sm:px-6 py-8 md:py-12 ">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Continue Your Course
          </h2>
          <div className="space-y-4">
            {enrollments.map((c) => {
              const courseTotalLessons =
                totalLessons.find((t) => t.courseId === c.courseId)
                  ?.lessonsCount || 0;
              const completedCount =
                completedLessonsState.data?.completed?.filter(
                  (lesson) => lesson.courseId === c.courseId
                ).length || 0;
              const progressPercent =
                courseTotalLessons > 0
                  ? (completedCount / courseTotalLessons) * 100
                  : 0;

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -2 }}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={`${c.course.course_img}`}
                      alt={c.course.title || "Course"}
                      className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg object-cover shadow-md flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1 sm:flex-none">
                      <h4 className="text-base sm:text-lg truncate font-medium text-gray-900 dark:text-gray-100 ">
                        {c.course.title.length > 50
                          ? c.course.title.slice(0, 50) + "...."
                          : c.course.title || "Untitled Course"}
                      </h4>
                      <div className="mt-1 sm:mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 w-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {progressPercent.toFixed()}% Complete
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToCourse(c.courseId)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full font-medium shadow-sm sm:shadow-md transition-colors duration-300 text-sm sm:text-base"
                  >
                    Continue
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Stats Section */}
      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 dark:bg-[#091025]  mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Students
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {fmt(studentsCount)}+
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <BookOpenCheck className="w-6 h-6 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Courses
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {fmt(coursesCount)}+
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Instructors
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {fmt(instructorsCount)}+
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completion
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {completionRate}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lazy-loaded sections with skeletons */}
      <Suspense fallback={<SectionSkeleton />}>
        <Categories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PopularCourses />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LearningPaths />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Trusted />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Testemonials />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CTA />
      </Suspense>
    </div>
  );
}
