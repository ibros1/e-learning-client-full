import {
  faBook,
  faCircleCheck,
  faCircleXmark,
  faBookOpen,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateLessonDailog from "../components/lessons/createLessonDailog";
import { Button } from "../../components/ui/button";
import { type AppDispatch, type RootState } from "../../store/store";
import { listLessonsFn } from "../../store/slices/lessons/listLessons";

import { listChaptersFn } from "../../store/slices/chapters/listChapters";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
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
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { listCoursesFn } from "../../store/slices/courses/listCourse";

import {
  resetUpdateLessonState,
  updateLessonFn,
} from "../../store/slices/lessons/updateLesson";
import toast from "react-hot-toast";
import type { Lesson } from "../../types/lesson";

import {
  deleteLessonFn,
  resetDeleteLessonState,
} from "../../store/slices/lessons/deleteLesson";
import LessonsSkeleton from "../../components/ui/LessonsSkeleton";

import Spinner from "../../components/spinner";

const Lessons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  const listLessonState = useSelector(
    (state: RootState) => state.listLessonSlice
  );

  useEffect(() => {
    dispatch(listChaptersFn());
    dispatch(listCoursesFn());
  }, [dispatch]);

  const lessons = listLessonState.data?.lessons
    ?.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.chapters.chapterTitle
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lesson.courseId.toString().includes(searchTerm)
    )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const courses = coursesState.data?.courses;

  const chaptersState = useSelector(
    (state: RootState) => state.listChaptersSlice
  );
  const chapters = chaptersState.data?.chapters;

  const stats = {
    totalLessons: listLessonState.data?.lessons?.length || 0,
    completed: 18,
    notCompleted: 14,
    totalChapters: 7,
  };

  useEffect(() => {
    dispatch(listLessonsFn());
  }, [dispatch]);
  const logInState = useSelector((state: RootState) => state.loginSlice);

  // update
  const [, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const updateState = useSelector(
    (state: RootState) => state.updateLessonSlice
  );
  const updateLessonHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateLessonFn({
        id: selectedLessonId,
        chapterId: selectedChapterId,
        userId: logInState.data?.user?.id,
        courseId: +selectedCourseId,
        title: title,
        content: content,
        video_url: videoUrl,
      })
    );
  };

  useEffect(() => {
    if (updateState.error) {
      toast.error(updateState.error);
      setIsEditDialogOpen(false);
      return;
    }
    if (updateState.data?.isSuccess) {
      toast.success("Successfully updated lesson!");

      setIsEditDialogOpen(false);
      dispatch(resetUpdateLessonState());
      dispatch(listLessonsFn());
    }
  }, [updateState, dispatch]);

  // delete
  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);
  const lessonId = selectedLessonId;
  const deleteLessonHandler = () => {
    dispatch(deleteLessonFn(lessonId));
  };
  const deleteState = useSelector(
    (state: RootState) => state.deleteLessonSlice
  );
  useEffect(() => {
    if (deleteState.error) {
      toast.error(deleteState.error);
      return;
    }
    if (deleteState.data.isSuccess) {
      toast.success("Successfully Deleted Lesson!");
      dispatch(resetDeleteLessonState());
      dispatch(listLessonsFn());
    }
  }, [deleteState, dispatch]);
  const lessonsList = useSelector((state: RootState) => state.listLessonSlice);

  if (lessonsList.loading) {
    return <LessonsSkeleton />;
  }

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-[#0b1120] text-foreground space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Lessons Dashboard</h1>
        <CreateLessonDailog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={faBook}
          value={stats.totalLessons}
          label="Total Lessons"
          bg="bg-blue-100 dark:bg-blue-800"
          color="text-blue-700 dark:text-blue-200"
        />
        <StatCard
          icon={faCircleCheck}
          value={stats.completed}
          label="Completed"
          bg="bg-green-100 dark:bg-green-800"
          color="text-green-700 dark:text-green-200"
        />
        <StatCard
          icon={faCircleXmark}
          value={stats.notCompleted}
          label="Not Completed"
          bg="bg-red-100 dark:bg-red-800"
          color="text-red-700 dark:text-red-200"
        />
        <StatCard
          icon={faBookOpen}
          value={stats.totalChapters}
          label="Total Chapters"
          bg="bg-yellow-100 dark:bg-yellow-800"
          color="text-yellow-700 dark:text-yellow-200"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search lessons…"
          className="w-full rounded-lg pl-10 pr-4 py-2 border border-input bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lessons Table */}
      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted/50">
            <tr className="text-sm font-semibold text-muted-foreground uppercase">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Chapter</th>
              <th className="px-4 py-3">Course_Title</th>
              <th className="px-4 py-3">Course_ID</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Video</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lessons?.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-muted transition-colors">
                <td className="px-4 py-3 max-w-[180px] truncate">
                  {lesson.title}
                </td>
                <td className="px-4 py-3 max-w-[240px] truncate">
                  {lesson.content}
                </td>
                <td className="px-4 py-3 max-w-[160px] truncate">
                  {lesson.chapters?.chapterTitle ?? "N/A"}
                </td>
                <td className="px-4 py-3 max-w-[160px] truncate">
                  {lesson.courses.title ?? "N/A"}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  #{lesson.courseId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={`${lesson.users.profilePhoto}`}
                      alt={lesson.users.full_name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="truncate">{lesson.users.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(lesson.created_at).toLocaleDateString("en-Us", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Watch
                    </Button>
                  </a>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLessonId(lesson.id);

                      setSelectedCourseId(lesson.courseId.toString());
                      setSelectedChapterId(lesson.chapterId.toString());
                      setSelectedLesson(lesson);
                      setTitle(lesson.title);
                      setContent(lesson.content);
                      setVideoUrl(lesson.video_url);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setIsDeletedDailogOpen(true);

                      setSelectedLessonId(lesson.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {!lessons?.length && (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  No lessons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={updateLessonHandler} className="space-y-6">
            <AlertDialogHeader>
              <DialogTitle>Update Lesson</DialogTitle>
              <DialogDescription>
                Make changes to this lesson’s content below.
              </DialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4">
              {/* Course Selection */}
              <div className="grid gap-2">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  className="border rounded-xl py-2 px-3 w-full"
                  value={selectedCourseId || ""}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Course --</option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Selection */}
              <div className="grid gap-2">
                <Label htmlFor="chapter">Chapter</Label>
                <select
                  id="chapter"
                  className="border rounded-xl py-2 px-3 w-full"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Chapter --</option>
                  {chapters
                    ?.filter(
                      (chapter) =>
                        chapter.courseId.toString() === selectedCourseId
                    )
                    .map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.chapterTitle}
                      </option>
                    ))}
                </select>
              </div>

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Content */}
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content || ""}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Video URL */}
              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl || ""}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="pt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                disabled={updateState.loading}
                type="submit"
                className="bg-blue-600 disabled:bg-gray-500 disabled:hover:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                {updateState.loading ? <Spinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={setIsDeletedDailogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Are you absolutely sure to delete this lesson?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              lessons! and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-4">
            <AlertDialogCancel className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteLessonHandler}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/* ── Reusable Stat Card ── */
interface StatCardProps {
  icon: IconDefinition;
  value: string | number;
  label: string;
  bg: string;
  color: string;
}

const StatCard = ({ icon, value, label, bg, color }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out">
    <div className={`${bg} ${color} p-3 rounded-full`}>
      <FontAwesomeIcon icon={icon} className="text-2xl" />
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  </div>
);

export default Lessons;
