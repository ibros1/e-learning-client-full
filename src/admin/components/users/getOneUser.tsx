import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_API_URL } from "../../../constants/base_url";
import type { AppDispatch, RootState } from "../../../store/store";
import { getOneUserFn } from "../../../store/slices/auth/user/getOneUser";
import { listEnrollementsFn } from "../../../store/slices/enrollments/listEnrollements";
import { listCoursesFn } from "../../../store/slices/courses/listCourse";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

const GetOneUser = () => {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const dispatch = useDispatch<AppDispatch>();
  const [previewImage, setPreviewImage] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const viewImageHandler = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsImageDialogOpen(true);
    console.log(imageUrl);
  };

  useEffect(() => {
    if (userId) {
      dispatch(getOneUserFn(numericUserId));
      dispatch(listEnrollementsFn());
      dispatch(listCoursesFn());
    }
  }, [dispatch, userId, numericUserId]);

  const {
    data: userData,
    loading,
    error,
  } = useSelector((state: RootState) => state.getOneUserSLice);
  const user = userData?.user;
  const profileImageUrl = `${user?.profilePhoto}`;

  const enrollments = useSelector(
    (state: RootState) => state.listEnrollementsSlice.data.enrollemnets
  );
  const courses = useSelector(
    (state: RootState) => state.listCoursesSlice.data.courses
  );

  if (loading) {
    return (
      <div className="p-10 space-y-6">
        <Skeleton className="w-full h-48 rounded-xl" />
        <Skeleton className="w-1/3 h-8" />
        <Skeleton className="w-1/2 h-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load user data.
      </div>
    );
  }

  const userEnrollments = enrollments?.filter((e) => e.userId === user.id);
  const enrolledCourses = courses?.filter((course) =>
    course.enrollments?.some((en) => en.userId === user.id)
  );

  return (
    <div className="w-full mx-auto px-6 py-10 space-y-10 bg-white dark:bg-[#091025]">
      {/* Cover and Profile */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
        <img
          src={`${user.coverPhoto}`}
          alt="Cover"
          className="w-full h-60 object-cover cursor-pointer"
          onClick={() => viewImageHandler(`${user.coverPhoto}`)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none" />
        <div className="absolute bottom-6 left-6 flex items-center gap-6">
          <img
            src={`${user.profilePhoto}`}
            alt={user.full_name}
            className="w-28 h-28 cursor-pointer rounded-full border-4 border-white object-cover shadow-lg"
            onClick={() => viewImageHandler(profileImageUrl)}
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p className="text-sm opacity-80">@{user.username}</p>
            <Badge
              variant={user.is_active ? "default" : "destructive"}
              className="mt-2"
            >
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* User Info */}
      <section>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mx-6">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6">
            User Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Email
              </span>
              <span className="text-base font-semibold">{user.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Phone
              </span>
              <span className="text-base font-semibold">
                {user.phone_number}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Sex
              </span>
              <span className="text-base font-semibold">{user.sex}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Role
              </span>
              <span className="text-base font-semibold capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                User ID
              </span>
              <span className="text-base font-semibold">{user.id}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Joined
              </span>
              <span className="text-base font-semibold">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                Last Active
              </span>
              <span className="text-base font-semibold">
                {new Date(user.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="space-y-4 px-8">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          Courses
        </h2>
        {enrolledCourses?.length === 0 ? (
          <p className="text-muted-foreground">No courses enrolled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses?.map((course) => {
              const progress =
                userEnrollments?.find((e) => e.courseId === course.id)
                  ?.progress ?? 0;
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-900 border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <img
                    src={`${BASE_API_URL}/uploads/${course.course_img}`}
                    alt={course.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Progress: {progress}%
                    </p>
                    <div className="w-full h-2 bg-muted rounded mt-2">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Orders */}
      <section className="space-y-4 px-8">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          Orders
        </h2>
        {userEnrollments?.length === 0 ? (
          <p className="text-muted-foreground">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {userEnrollments?.map((order) => {
              const courseObj = courses?.find((c) => c.id === order.courseId);
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-900 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-primary dark:text-blue-300">
                    {courseObj?.title ?? "Unknown Course"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={
                        order.status === "Completed"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full rounded-xl shadow-sm"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetOneUser;
