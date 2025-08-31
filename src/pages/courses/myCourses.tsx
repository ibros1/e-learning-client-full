import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";

import { useNavigate } from "react-router-dom";
import MyProfileContainer from "../../components/Profile/profileContainer";
import { Button } from "../../components/ui/button";

import { listCoursesFn } from "../../store/slices/courses/listCourse";
import { WhoAmiFn } from "../../store/slices/auth/user/getMe";

import { getCompletedLessonsFn } from "../../store/lessonProggress/getCompletedProggress";
import MyProfileSkeleton from "../../components/ui/myProfileSkeleton";

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(listCoursesFn());
    dispatch(WhoAmiFn());
  }, [dispatch]);

  // Redux States
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );

  // useEffect(() => {

  // },[])
  userState?.data?.user?.enrollements?.map((enrl) => {
    console.log(enrl.courseId);
  });
  useEffect(() => {
    if (userState.data?.user?.id) {
      dispatch(getCompletedLessonsFn(userState.data.user.id));
    }
  }, [dispatch, userState.data?.user?.id]);

  const completedState = useSelector(
    (state: RootState) => state.getCompletedLessonsSlice
  );

  // Get completed lessons for the current user
  useEffect(() => {
    if (userState.data?.user?.id) {
      dispatch(getCompletedLessonsFn(userState.data.user.id));
    }
  }, [dispatch, userState.data?.user?.id]);

  // Function to get progress percentage for a course
  const getCourseProgress = (courseId: string) => {
    const completedLessons =
      completedState.data?.completed?.filter((c) => c.courseId === +courseId)
        ?.length || 0;

    const totalLessons =
      coursesState.data?.courses
        ?.find((course) => course.id === +courseId)
        ?.lesson?.reduce(
          (sum) => sum + (10 + coursesState.data?.courses.length || 0),
          0
        ) || 0;

    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const updateEnrollState = useSelector(
    (state: RootState) => state.updateEnrollementSlice
  );

  useEffect(() => {
    if (updateEnrollState.data?.isSuccess) {
      dispatch(WhoAmiFn()); // ✅ Correct - fetches full user with enrollements
    }
  }, [updateEnrollState, dispatch]);

  const user = userState.data.user;

  if (!user || coursesState.loading || coursesState.data === null) {
    return (
      <div className="flex justify-center items-center ">
        <MyProfileSkeleton />
      </div>
    );
  }

  const enrolledCourses = userState.data?.user?.enrollements;
  const myEnrolledCourses = userState?.data?.user?.enrollements.map(
    (enrl) => enrl.is_enrolled === true
  );

  return (
    <main className="bg-gray-50 dark:bg-[#091025] min-h-screen">
      <div className="mx-auto flex flex-col gap-8 ">
        <MyProfileContainer />

        <section className="pb-32 pt-8 px-6">
          {/* Header with buttons */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-3">
              <Button variant={"outline"}>My Courses</Button>
              <Button
                variant={"outline"}
                onClick={() => navigate("/courses")}
                className="bg-gray-100"
              >
                All Courses
              </Button>
            </div>
            <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              {myEnrolledCourses?.length}{" "}
              {myEnrolledCourses?.length === 1 ? "Course" : "Courses"}
            </span>
          </div>

          {/* No enrolled courses message */}
          {enrolledCourses?.length === 0 && (
            <p className="text-gray-700 dark:text-gray-300 mt-6">
              You are not enrolled in any courses yet. Go to All Courses to
              enroll and pay.
            </p>
          )}

          {/* Enrolled courses grid */}
          <div
            className="
  grid 
  grid-cols-1 
  xs:grid-cols-2
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4 sm:gap-6 
  mt-6
"
          >
            {enrolledCourses
              ?.filter((enroll) => enroll.is_enrolled)
              .map((enrll) => {
                return (
                  <div
                    key={enrll.course.id}
                    className="
            group 
            bg-white dark:bg-[#0d1324] 
            h-auto sm:h-[500px] 
            rounded-2xl 
            border border-gray-200 dark:border-gray-700 
            shadow-sm 
            hover:shadow-lg 
            hover:-translate-y-1 
            transition-all duration-300 
            overflow-hidden 
            cursor-pointer
          "
                    onClick={() =>
                      navigate(`/my-courses/continue/${enrll.courseId}`)
                    }
                  >
                    {/* Image */}
                    <div className="relative h-[180px] sm:h-[200px] w-full">
                      <img
                        src={`${enrll.course.course_img}`}
                        alt={enrll.course.title}
                        className="object-cover h-full w-full"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-xl text-xs font-semibold text-white shadow">
                        Continue Course
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex flex-col h-full justify-between">
                      <div>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                          {enrll.course.chapters?.length || 0} Chapter
                          {enrll.course.chapters?.length !== 1 && "s"}
                        </p>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {enrll.course.title}
                        </h2>
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                          {enrll.course.description.length > 80
                            ? enrll.course.description.slice(0, 80) + "..."
                            : enrll.course.description}
                        </div>

                        {/* Progress */}
                        <div className="pt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <img
                              src={`${user.profilePhoto}`}
                              alt={user.full_name}
                              className="w-7 h-7 rounded-full object-cover border"
                            />
                            <span>{user.full_name}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                              className="bg-blue-600 transition-all duration-300"
                              style={{
                                width: `${getCourseProgress(
                                  enrll.courseId.toString()
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Button */}
                      <Button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-courses/continue/${enrll.course.id}`);
                        }}
                      >
                        Continue Course
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyCourses;
