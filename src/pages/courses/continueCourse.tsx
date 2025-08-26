import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronRight,
  CheckCircle,
  PlayCircle,
  BookOpen,
  X,
  FileText,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Circle,
  Check,
} from "lucide-react";
import { getOneCourseFn } from "../../store/slices/courses/getOneCourse";
import type { RootState, AppDispatch } from "../../store/store";
import { BASE_API_URL } from "../../constants/base_url";
import toast from "react-hot-toast";

import Plyr from "plyr-react";
import "plyr-react/plyr.css";

import type { SourceInfo } from "plyr";
import { getLessonProgressFn } from "../../store/lessonProggress/getLessonProggress";
import { createLessonProgressFn } from "../../store/lessonProggress/makeProgress";
import { getCompletedLessonsFn } from "../../store/lessonProggress/getCompletedProggress";

const getYouTubeId = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
    if (urlObj.hostname.includes("youtube.com"))
      return urlObj.searchParams.get("v") || "";
  } catch {
    return "";
  }
  return "";
};

const formatVideoUrl = (url: string) => {
  if (!url) return "";

  try {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");

    return urlObj.toString();
  } catch {
    const encodedPath = encodeURIComponent(url.trim()).replace(/%2F/g, "/");
    return url.startsWith("http") ? url : `${BASE_API_URL}/${encodedPath}`;
  }
};

const ContinueCourse = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId?: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux selectors
  const { data, loading } = useSelector(
    (state: RootState) => state.getOneCourseSlice
  );
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  const loginUserState = useSelector((state: RootState) => state.loginSlice);
  const completeLessonState = useSelector(
    (state: RootState) => state.getCompletedLessonsSlice
  );
  const createProgressState = useSelector(
    (state: RootState) => state.createLessonProgressSlice
  );

  const course = data?.course;
  const user = userState?.data?.user;
  const loginUser = loginUserState.data?.user;

  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
    lessonId
  );
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sort lessons
  const sortedLessons = useMemo(() => {
    return [...(course?.lesson || [])].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [course]);

  // Current lesson
  const currentLesson = useMemo(() => {
    return (
      sortedLessons.find((l) => l.id === currentLessonId) || sortedLessons[0]
    );
  }, [sortedLessons, currentLessonId]);

  // Get YouTube ID and video type
  const youtubeId = useMemo(() => {
    return getYouTubeId(currentLesson?.video_url || "");
  }, [currentLesson?.video_url]);

  // Plyr source configuration
  const source: SourceInfo = useMemo(() => {
    if (youtubeId) {
      return {
        type: "video",
        sources: [
          {
            src: youtubeId,
            provider: "youtube",
          },
        ],
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
      };
    } else {
      return {
        type: "video",
        sources: [
          {
            src: formatVideoUrl(currentLesson?.video_url || ""),
            type: "video/mp4",
          },
        ],
      };
    }
  }, [currentLesson?.video_url, youtubeId]);

  // Group chapters
  const chaptersWithLessons = useMemo(() => {
    return (
      course?.chapters.map((chapter) => ({
        ...chapter,
        lessons: sortedLessons.filter(
          (lesson) => lesson.chapterId === chapter.id
        ),
      })) || []
    );
  }, [course, sortedLessons]);

  const totalLessons = sortedLessons.length;
  const completedLessonsCount =
    completeLessonState.data?.completed?.length || 0;

  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100))
      : 0;

  const completedLessonIds = useMemo(() => {
    return new Set(
      completeLessonState.data?.completed
        ?.filter((item) => item.isCompleted)
        .map((item) => item.lessonId) || []
    );
  }, [completeLessonState]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load course data
  useEffect(() => {
    if (courseId) dispatch(getOneCourseFn(+courseId));
  }, [dispatch, courseId]);

  // Load completed lessons
  useEffect(() => {
    if (user?.id) {
      dispatch(getCompletedLessonsFn(user.id));
    }
  }, [dispatch, user?.id]);

  // Update current lesson
  useEffect(() => {
    if (lessonId) {
      setCurrentLessonId(lessonId);
    } else if (sortedLessons.length) {
      setCurrentLessonId(sortedLessons[0].id);
    }
  }, [lessonId, sortedLessons]);

  // Expand current chapter
  useEffect(() => {
    if (
      currentLesson?.chapterId &&
      !expandedChapters.includes(currentLesson.chapterId)
    ) {
      setExpandedChapters((prev) => [...prev, currentLesson.chapterId]);
    }
  }, [currentLesson, expandedChapters]);

  // Fetch lesson progress
  useEffect(() => {
    const fetchLessonProgress = async () => {
      if (!user || !currentLesson?.id) return;
      try {
        const result = await dispatch(
          getLessonProgressFn({ userId: user.id, lessonId: currentLesson.id })
        ).unwrap();
        setLessonCompleted(result?.progress?.isCompleted ?? false);
      } catch {
        setLessonCompleted(false);
      }
    };
    fetchLessonProgress();
  }, [dispatch, user, currentLesson?.id]);

  // Refresh completed lessons
  useEffect(() => {
    if (createProgressState.data.isSuccess && user?.id) {
      dispatch(getCompletedLessonsFn(user.id));
    }
  }, [createProgressState, dispatch, user?.id]);

  // Mark lesson completed/incomplete
  const completedHandler = async () => {
    if (!user || !currentLesson) return;
    const newStatus = !lessonCompleted;
    try {
      await dispatch(
        createLessonProgressFn({
          userId: user.id,
          courseId: currentLesson.courseId,
          lessonId: currentLesson.id,
          isCompleted: newStatus,
        })
      ).unwrap();
      setLessonCompleted(newStatus);
      await dispatch(
        getLessonProgressFn({ userId: user.id, lessonId: currentLesson.id })
      );
      toast.success(
        newStatus ? "Marked as completed!" : "Marked as incomplete!"
      );
    } catch {
      toast.error("Could not update progress");
    }
  };

  // Navigate to lesson
  const handleLessonClick = (id: string) => {
    setCurrentLessonId(id);
    navigate(`/my-courses/continue/${courseId}/${id}`);
    setIsSidebarOpen(false);
  };

  // Toggle chapter
  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Navigation
  const currentIndex =
    sortedLessons.findIndex((l) => l.id === currentLessonId) ?? 0;
  const prevLesson = sortedLessons[currentIndex - 1];
  const nextLesson = sortedLessons[currentIndex + 1];

  // Early returns
  if (loading) return <div className="p-12 text-center">Loading course...</div>;
  if (!course)
    return (
      <div className="p-12 text-center text-red-500">
        Course not found or no lessons available.
      </div>
    );
  if (!currentLesson)
    return (
      <div className="p-12 text-center text-red-500">
        No lessons found. Please contact admin.
      </div>
    );
  if (!loginUser) return <div>Please login first!</div>;

  // Check enrollment
  const isUserEnrolled = user?.enrollements?.some(
    (en) => en.courseId === +courseId! && en.is_enrolled
  );
  if (!isUserEnrolled) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You must enroll in this course to access its content.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get appropriate icon for lesson type
  const getLessonIcon = (lesson: any) => {
    if (lesson.video_url) {
      return <PlayCircle size={16} className="text-blue-500 flex-shrink-0" />;
    } else if (lesson.file_url) {
      return <FileText size={16} className="text-purple-500 flex-shrink-0" />;
    }
    return <BookOpen size={16} className="text-green-500 flex-shrink-0" />;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0c1425] dark:to-[#060a15]">
      {/* LearnDash-Style Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[70%] md:w-80 z-50 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 shadow-lg transition-transform duration-500 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full "
        }`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Course navigation sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111c36]">
            <div className="flex justify-between items-start">
              <div>
                <button
                  onClick={() => navigate("/my-courses")}
                  className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
                  aria-label="Back to courses"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Back to Course
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {course.title}
                </h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className=" p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close sidebar"
              >
                <X size={22} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {progressPercent}% Complete
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {completedLessonsCount}/{totalLessons} Lessons
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last activity on{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Chapters Scrollable Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="p-2">
              {chaptersWithLessons.map((chapter) => {
                const expanded = expandedChapters.includes(chapter.id);
                return (
                  <div
                    key={chapter.id}
                    className="mb-1 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-200"
                  >
                    {/* Chapter Header */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      aria-expanded={expanded}
                      aria-controls={`chapter-${chapter.id}-lessons`}
                    >
                      <div className="flex items-center">
                        <ChevronRight
                          size={16}
                          className={`mr-2 transition-transform ${
                            expanded ? "rotate-90" : ""
                          } text-gray-500 dark:text-gray-400`}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate font-semibold text-gray-900 dark:text-white ">
                          {chapter.chapterTitle.length > 25
                            ? chapter.chapterTitle.slice(0, 25) + "..."
                            : chapter.chapterTitle}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-1">
                          {chapter.lessons.length}
                        </span>
                        {expanded ? (
                          <ChevronUp
                            size={16}
                            className="ml-2 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="ml-2 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>

                    {/* Lessons */}
                    {expanded && (
                      <ul
                        id={`chapter-${chapter.id}-lessons`}
                        className="border-t border-gray-100 dark:border-gray-800"
                      >
                        {chapter.lessons.map((lesson) => {
                          const isActive = lesson.id === currentLessonId;
                          const isCompleted = completedLessonIds.has(lesson.id);
                          return (
                            <li
                              key={lesson.id}
                              className={`border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <button
                                onClick={() => handleLessonClick(lesson.id)}
                                className={`flex items-center w-full p-3 pl-6 text-left transition-colors`}
                                aria-current={isActive ? "page" : undefined}
                              >
                                <div className="mr-3">
                                  {getLessonIcon(lesson)}
                                </div>
                                <span
                                  className={`flex-1 truncate ${
                                    isCompleted
                                      ? "text-gray-500 dark:text-gray-400 line-through"
                                      : "text-gray-700 dark:text-gray-300"
                                  } ${
                                    isActive
                                      ? "font-medium text-blue-600 dark:text-blue-300"
                                      : ""
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                <div>
                                  {isCompleted ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <Check size={12} className="text-white" />
                                    </div>
                                  ) : isActive ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                  ) : (
                                    <Circle
                                      size={16}
                                      className="text-gray-400 dark:text-gray-500"
                                      strokeWidth={1.5}
                                    />
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 "
          aria-label="Close sidebar"
          role="button"
          tabIndex={0}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen  ${
          isSidebarOpen
            ? "md:ml-80 transition duration-300"
            : "md:ml0 transition duration-300"
        }`}
      >
        <div
          className={`fixed w-screen top-0 left-0  right-0 py-4 px-6 flex items-center justify-between backdrop-blur-md z-20 transition-all duration-300 ${
            isScrolled
              ? "bg-white/90 dark:bg-[#0c1425]/90 shadow-sm top-0"
              : "bg-transparent top-16 xl:top-0"
          }`}
        >
          {/* Floating Sidebar Toggle */}
          <div className=" flex gap-8">
            <div className="">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen((prev) => !prev);
                }}
                className={`fixed top-2 left-4 xl:top-2 z-50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full  transition-all duration-300 ${
                  isSidebarOpen ? "rotate-180" : ""
                }`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <li className="bb-icon-l text-[30px] bb-icon-sidebar text-gray-700  dark:text-gray-300" />
              </button>
            </div>
            <div className="">
              <button
                onClick={() => navigate("/my-courses")}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Back to courses"
              >
                <ChevronLeft size={20} className="mr-1" />
                My Courses
              </button>
            </div>
          </div>
          <h2 className="text-xl font-bold truncate max-w-[50%]">
            {course.title}
          </h2>
          <div className="w-10" />
        </div>

        <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={
                      course?.users?.profilePhoto
                        ? `${course.users.profilePhoto}`
                        : "/default-avatar.png"
                    }
                    alt="Instructor"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white dark:border-gray-800 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <BookOpen size={14} className="text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {course.users?.full_name} •{" "}
                  {new Date(currentLesson.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-5">
                <p className="text-lg font-medium flex items-center">
                  <span className="mr-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    ?
                  </span>
                  What is {currentLesson.title}?
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
              {currentLesson.content}
            </p>
          </div>

          {/* Video Player Container */}
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="relative aspect-video">
              {currentLesson?.video_url ? (
                youtubeId ? (
                  <Plyr source={source} />
                ) : (
                  <Plyr source={source} />
                )
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900 text-white text-lg font-semibold">
                  📂 No video available for this lesson
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={completedHandler}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.03] ${
                lessonCompleted
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
              } ${!lessonCompleted ? "animate-pulse" : ""}`}
              aria-pressed={lessonCompleted}
            >
              {lessonCompleted ? (
                <span className="flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  Completed
                </span>
              ) : (
                "Mark as Complete"
              )}
            </button>

            <div className="flex gap-4 ml-auto">
              {prevLesson && (
                <button
                  onClick={() => handleLessonClick(prevLesson.id)}
                  className="flex items-center px-5 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Previous lesson"
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Previous
                </button>
              )}

              {nextLesson && (
                <button
                  onClick={() => handleLessonClick(nextLesson.id)}
                  className="flex items-center px-5 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Next lesson"
                >
                  Next
                  <ChevronRight size={20} className="ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Course Progress Footer */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Course Completion</h3>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {completedLessonsCount}/{totalLessons} lessons
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContinueCourse;
