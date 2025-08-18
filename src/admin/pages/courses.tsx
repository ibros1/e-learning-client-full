import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { listCoursesFn } from "../../store/slices/courses/listCourse";

import { Pencil, Trash2, Search, UploadCloud, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  faPenToSquare,
  faBook,
  faDollarSign,
  faImage,
  faPhotoFilm,
  faVideo,
  faFileLines,
  faCircleCheck,
  faCircleXmark,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  resetUpdateCourseSlice,
  updateCourseFn,
} from "../../store/slices/courses/updateCourse";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  deleteCoursesFn,
  resetDeleteCourseState,
} from "../../store/slices/courses/deleteCourse";
import CreateCourseDialog from "../components/courses/CreateCourseDailog";
import type { Course } from "../../types/course";
import Spinner from "../../components/spinner";

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "UNPUBLISHED">(
    "ALL"
  );
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const updateCourseState = useSelector(
    (state: RootState) => state.updateCourseSlice
  );
  const deleteCourseState = useSelector(
    (state: RootState) => state.deleteCoursesSlice
  );

  const allCourses = coursesState.data?.courses || [];
  const courses = allCourses;

  // Calculate summary counts for info cards
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.is_published).length;
  const unpublishedCourses = courses.filter((c) => !c.is_published).length;
  const onSaleCourses = courses.filter((c) => c.price > 0).length;

  // Load courses when admin is logged in
  useEffect(() => {
    if (loginState.data.isSuccess) {
      dispatch(listCoursesFn())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [dispatch, loginState.data.isSuccess]);

  // Form and dialog state
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublished, setisPublished] = useState(false);
  const [course_img, setCourse_img] = useState<File | null>(null);
  const [cover_img, setCover_img] = useState<File | null>(null);
  const [preview_course, setPreview_course] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [courseImgPreview, setCourseImgPreview] = useState<string | null>(null);
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null);

  // Load selected course data into form when selection changes
  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title);
      setDesc(selectedCourse.description);
      setPrice(Number(selectedCourse.price));
      setisPublished(selectedCourse.is_published);
      setPreview_course(selectedCourse.preview_course_url || "");
      setCourseImgPreview(selectedCourse.course_img || null);
      setCoverImgPreview(selectedCourse.cover_img || null);
      // Reset files on new selection
      setCourse_img(null);
      setCover_img(null);
    }
  }, [selectedCourse]);

  // Close dialog and refresh list after successful update
  useEffect(() => {
    if (updateCourseState.error) {
      toast.dismiss();
      toast.error(updateCourseState.error);
      return;
    }
    if (updateCourseState.loading) {
      toast.dismiss();
      toast.loading("Updating course...");
      return;
    }
    if (updateCourseState.data?.isSuccess) {
      setSelectedCourse(null);
      setIsEditCourseDialogOpen(false);
      toast.dismiss();
      toast.success("Successfully updated course!");
      dispatch(listCoursesFn());
      dispatch(resetUpdateCourseSlice());
    }
  }, [updateCourseState, dispatch]);

  useEffect(() => {
    if (deleteCourseState.error) {
      toast.dismiss();
      toast.error(deleteCourseState.error);
      return;
    }
    if (deleteCourseState.loading) {
      toast.dismiss();
      toast.loading("Deleting course...");
      return;
    }
    if (deleteCourseState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Successfully deleted course!");
      dispatch(resetDeleteCourseState());
      dispatch(listCoursesFn());
      setIsDeletedDailogOpen(false);
    }
  }, [deleteCourseState, dispatch]);

  // Handle course update form submit
  const updateHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const formData = new FormData();
    formData.append("id", selectedCourse.id.toString());
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("price", price.toString());
    formData.append("isPublished", isPublished.toString());
    formData.append("preview_course", preview_course);

    if (course_img) {
      formData.append("course_img", course_img);
    }
    if (cover_img) {
      formData.append("cover_img", cover_img);
    }

    dispatch(updateCourseFn(formData));
  };

  const deleteCourseHandler = () => {
    if (selectedCourse?.id) {
      dispatch(deleteCoursesFn(selectedCourse.id));
    }
  };

  // Handle image change for edit form
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "course_img" | "cover_img",
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (field === "course_img") setCourse_img(file);
      if (field === "cover_img") setCover_img(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  // Filter courses based on search and status filter
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesSearch =
          course.id.toString().includes(searchTerm) ||
          course.price.toString().includes(searchTerm) ||
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
          filter === "ALL"
            ? true
            : filter === "PUBLISHED"
            ? course.is_published
            : !course.is_published;
        return matchesSearch && matchesFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [courses, searchTerm, filter]);

  if (!loginState.data.isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-2xl text-red-600 font-bold py-10">
          Please login to access this page
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Info Cards / Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Total Courses */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-4 md:p-6 flex items-center gap-3 hover:shadow-md transition">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 p-2.5 rounded-full">
            <FontAwesomeIcon icon={faBook} className="text-xl" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {totalCourses}
            </div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Total Courses
            </div>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-4 md:p-6 flex items-center gap-3 hover:shadow-md transition">
          <div className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 p-2.5 rounded-full">
            <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {publishedCourses}
            </div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Published
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-4 md:p-6 flex items-center gap-3 hover:shadow-md transition">
          <div className="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 p-2.5 rounded-full">
            <FontAwesomeIcon icon={faCircleXmark} className="text-xl" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {unpublishedCourses}
            </div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Draft
            </div>
          </div>
        </div>

        {/* On Sale */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-xl p-4 md:p-6 flex items-center gap-3 hover:shadow-md transition">
          <div className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 p-2.5 rounded-full">
            <FontAwesomeIcon icon={faDollarSign} className="text-xl" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {onSaleCourses}
            </div>
            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              On Sale
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mb-6">
        <div className="relative w-full md:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search courses by title, ID, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm dark:bg-gray-900 dark:text-white text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-3 md:mt-0">
          {["ALL", "PUBLISHED", "UNPUBLISHED"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as typeof filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === type
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              aria-pressed={filter === type}
            >
              {type}
            </button>
          ))}

          <div className="ml-auto md:ml-0">
            <CreateCourseDialog />
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
        {filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-8 text-center rounded-xl">
            <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No courses found
            </div>
            <p className="mt-2 text-gray-400 dark:text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                {[
                  "#id",
                  "Image",
                  "Title",
                  "Description",
                  "Price",
                  "Status",
                  "Total_Orders",
                  "Total_Chapters",
                  "Total_Lessons",
                  "Preview",
                  "Author",
                  "Created",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Course Id */}
                  <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white">
                    #{course.id}
                  </td>
                  {/* Course Image */}
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    {course.course_img ? (
                      <img
                        src={course.course_img}
                        alt={course.title}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 md:w-12 md:h-12" />
                    )}
                  </td>

                  {/* Course Title */}
                  <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white max-w-[150px] md:max-w-xs truncate">
                    {course.title}
                  </td>
                  {/* Course Desc */}
                  <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-900 dark:text-white max-w-[150px] md:max-w-xs truncate">
                    {course.description}
                  </td>

                  {/* Course Price */}
                  <td className="px-4 py-3 md:px-6 md:py-4 text-green-600 font-semibold whitespace-nowrap">
                    ${course.price.toFixed(2)}
                  </td>

                  {/* Publish Status Badge */}
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        course.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Total  Orders */}
                  <td className="px-4 py-3 md:px-6 md:py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {course.enrollments?.length + " " + "Students"}
                  </td>
                  {/* Total  chapters */}
                  <td className="px-4 py-3 md:px-6 md:py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {course.chapters?.length + " " + "Chapters"}
                  </td>
                  {/* Total  lessons */}
                  <td className="px-4 py-3 md:px-6 md:py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {course.lesson?.length + " " + "Lessons"}
                  </td>

                  {/* Preview Link */}
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    {course.preview_course_url ? (
                      <a
                        href={course.preview_course_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>

                  {/* Author Photo & Name */}
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {course.users?.profilePhoto ? (
                        <img
                          src={course.users.profilePhoto}
                          alt={course.users.full_name}
                          className="w-8 h-8 rounded-full object-cover shadow"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
                      )}
                      <span
                        className="text-gray-900 dark:text-white font-medium truncate max-w-[80px] md:max-w-[120px] text-sm"
                        title={course.users?.full_name}
                      >
                        {course.users?.full_name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  {/* Created At */}
                  <td className="px-4 py-3 md:px-6 md:py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {new Date(course.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                  {/* Action Buttons */}
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Edit course"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsEditCourseDialogOpen(true);
                      }}
                      className="hover:bg-yellow-100 dark:hover:bg-yellow-900 transition p-1.5 rounded-md"
                    >
                      <Pencil className="text-yellow-600 w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete course"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsDeletedDailogOpen(true);
                      }}
                      className="hover:bg-red-100 dark:hover:bg-red-900 transition p-1.5 rounded-md"
                    >
                      <Trash2 className="text-red-600 w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Course Dialog */}
      <Dialog
        open={isEditCourseDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditCourseDialogOpen(false);
            setSelectedCourse(null);
          }
        }}
      >
        <DialogContent className="overflow-auto rounded-xl max-w-3xl max-h-[90vh] p-4 md:p-6 border bg-background shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <FontAwesomeIcon icon={faPenToSquare} /> Edit Course
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
              Modify the course details below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={updateHandleSubmit} className="space-y-6" noValidate>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label
                  htmlFor="title"
                  className="mb-2 block text-gray-700 dark:text-gray-300 font-medium"
                >
                  <FontAwesomeIcon icon={faBook} className="mr-2" /> Course
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="price"
                  className="mb-2 block text-gray-700 dark:text-gray-300 font-medium"
                >
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" /> Price
                  (USD)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  min="0"
                  step="0.01"
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label
                  htmlFor="course_img"
                  className="mb-2 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faImage} /> Course Image
                </Label>

                <div className="mb-2">
                  {courseImgPreview ? (
                    <div className="relative group mb-2">
                      <img
                        src={courseImgPreview}
                        alt="Course preview"
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCourse_img(null);
                          setCourseImgPreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="course_img"
                        className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center p-3">
                          <UploadCloud
                            size={20}
                            className="text-gray-400 mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Click to upload</span>
                          </p>
                          <p className="text-2xs text-gray-500 mt-1">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          id="course_img"
                          name="course_img"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              "course_img",
                              setCourseImgPreview
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="cover_img"
                  className="mb-2 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faPhotoFilm} /> Cover Image
                </Label>

                <div className="mb-2">
                  {coverImgPreview ? (
                    <div className="relative group mb-2">
                      <img
                        src={coverImgPreview}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCover_img(null);
                          setCoverImgPreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="cover_img"
                        className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center p-3">
                          <UploadCloud
                            size={20}
                            className="text-gray-400 mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Click to upload</span>
                          </p>
                          <p className="text-2xs text-gray-500 mt-1">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          id="cover_img"
                          name="cover_img"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              "cover_img",
                              setCoverImgPreview
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview & Description */}
            <div>
              <Label
                htmlFor="preview_course"
                className="mb-2 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faVideo} /> Preview Video (YouTube URL)
              </Label>
              <Input
                id="preview_course"
                value={preview_course}
                onChange={(e) => setPreview_course(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="mb-2 text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faFileLines} /> Description
              </Label>
              <Textarea
                id="description"
                value={desc}
                rows={4}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 transition min-h-[120px] dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={setisPublished}
                className="data-[state=checked]:bg-green-500"
              />
              <Label
                htmlFor="isPublished"
                className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
              >
                <FontAwesomeIcon
                  icon={isPublished ? faCircleCheck : faCircleXmark}
                  className={isPublished ? "text-green-500" : "text-red-500"}
                />
                {isPublished ? "Published" : "Unpublished"}
              </Label>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditCourseDialogOpen(false);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
              >
                Cancel
              </Button>
              <Button
                disabled={updateCourseState.loading}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {updateCourseState.loading ? <Spinner /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeletedDailogOpen(false);
            setSelectedCourse(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Confirm Course Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCourse?.title}</span>?
              This action cannot be undone and will permanently remove the
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCourseHandler}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              {deleteCourseState.loading ? <Spinner /> : "Delete Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCourses;
