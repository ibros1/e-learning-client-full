import {
  faBook,
  faCircleCheck,
  faCircleXmark,
  faBookOpen,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Eye,
  Pencil,
  Search,
  Trash2,
  Clock,
  Calendar,
  Star,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateLessonDailog from "../components/lessons/createLessonDailog";
import { Button } from "../../components/ui/button";
import { type AppDispatch, type RootState } from "../../store/store";
import { listLessonsFn } from "../../store/slices/lessons/listLessons";
import { listChaptersFn } from "../../store/slices/chapters/listChapters";
import { listCoursesFn } from "../../store/slices/courses/listCourse";
import {
  resetUpdateLessonState,
  updateLessonFn,
} from "../../store/slices/lessons/updateLesson";
import {
  deleteLessonFn,
  resetDeleteLessonState,
} from "../../store/slices/lessons/deleteLesson";

import {
  Dialog,
  DialogClose,
  DialogContent,
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
import LessonsSkeleton from "../../components/ui/LessonsSkeleton";
import Spinner from "../../components/spinner";
import toast from "react-hot-toast";
import type { Lesson } from "../../types/lesson";
import { Badge } from "../../components/ui/badge";

import type { SourceInfo } from "plyr";
import Plyr from "plyr-react";
import { BASE_API_URL } from "../../constants/base_url";

const Lessons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  const listLessonState = useSelector(
    (state: RootState) => state.listLessonSlice
  );

  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const courses = coursesState.data?.courses;

  const chaptersState = useSelector(
    (state: RootState) => state.listChaptersSlice
  );
  const chapters = chaptersState.data?.chapters;

  const logInState = useSelector((state: RootState) => state.loginSlice);

  const updateState = useSelector(
    (state: RootState) => state.updateLessonSlice
  );
  const deleteState = useSelector(
    (state: RootState) => state.deleteLessonSlice
  );

  useEffect(() => {
    dispatch(listChaptersFn());
    dispatch(listCoursesFn());
    dispatch(listLessonsFn());
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

  const stats = {
    totalLessons: listLessonState.data?.lessons?.length || 0,
    completed: 18,
    notCompleted: 14,
    totalChapters: 7,
  };

  // ───────────── UPDATE LESSON ─────────────
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const updateLessonHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateLessonFn({
        id: selectedLessonId,
        chapterId: selectedChapterId,
        userId: logInState.data?.user?.id,
        courseId: +selectedCourseId,
        title,
        content,
        video_url: videoUrl,
      })
    );
  };

  useEffect(() => {
    if (updateState.error) {
      toast.dismiss();
      toast.error(updateState.error);
      setIsEditDialogOpen(false);
      return;
    }
    if (updateState.loading) {
      toast.dismiss();
      toast.loading("Updating lesson...");
      return;
    }
    if (updateState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Successfully updated lesson!");
      setIsEditDialogOpen(false);
      dispatch(resetUpdateLessonState());
      dispatch(listLessonsFn());
    }
  }, [updateState, dispatch]);

  // ───────────── DELETE LESSON ─────────────
  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);
  const deleteLessonHandler = () => {
    dispatch(deleteLessonFn(selectedLessonId));
  };

  useEffect(() => {
    if (deleteState.error) {
      toast.dismiss();
      toast.error(deleteState.error);
      return;
    }
    if (deleteState.loading) {
      toast.dismiss();
      toast.loading("Deleting...");
      return;
    }
    if (deleteState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Successfully Deleted Lesson!");
      dispatch(resetDeleteLessonState());
      dispatch(listLessonsFn());
    }
  }, [deleteState, dispatch]);

  // ───────────── VIDEO MODAL ─────────────
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Plyr source configuration

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
  const source: SourceInfo = useMemo(() => {
    const url = selectedLesson?.video_url || "";
    const youtubeId = getYouTubeId(url);

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
            src: formatVideoUrl(url),
            type: "video/mp4",
          },
        ],
      };
    }
  }, [selectedLesson?.video_url]);

  const openVideoModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsVideoModalOpen(true);
  };

  if (listLessonState.loading) return <LessonsSkeleton />;

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
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Course ID</th>
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
                  {lesson.courses?.title ?? "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  #{lesson.courseId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                  <img
                    src={lesson.users.profilePhoto}
                    alt={lesson.users.full_name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="truncate">{lesson.users.full_name}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(lesson.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openVideoModal(lesson)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Watch
                  </Button>
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

      {/* Video Modal */}
      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="w-full max-w-7xl max-h-[90vh] p-0 rounded-xl bg-black text-white border-0 overflow-hidden flex flex-col">
          {/* Video Container */}
          <div className="w-full aspect-video">
            <Plyr source={source} />
          </div>

          {/* Lesson Details */}
          <div className="p-4 md:p-6  overflow-y-auto flex-1 space-y-4 bg-black text-white">
            {/* Title + Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h2 className="text-lg md:text-2xl font-bold">
                {selectedLesson?.title}
              </h2>
              <Badge
                variant="outline"
                className="bg-red-600 text-white border-0 text-xs md:text-sm"
              >
                HD
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>45 min</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedLesson?.created_at
                    ? new Date(selectedLesson.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (120 reviews)</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs md:text-sm">
                Education
              </Badge>
              <Badge variant="secondary" className="text-xs md:text-sm">
                {selectedLesson?.chapters?.chapterTitle}
              </Badge>
              <Badge variant="secondary" className="text-xs md:text-sm">
                Lesson
              </Badge>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {selectedLesson?.content ||
                "No description available for this lesson."}
            </p>

            {/* Instructor */}
            <div className="pt-4 border-t border-gray-800">
              <h3 className="font-semibold mb-3 text-base md:text-lg">
                Instructor
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={selectedLesson?.users?.profilePhoto}
                  alt={selectedLesson?.users?.full_name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <div className="font-medium text-sm md:text-base">
                    {selectedLesson?.users?.full_name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    Course Instructor
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="pt-4 border-t border-gray-800">
              <h3 className="font-semibold mb-2 text-base md:text-lg">
                Course Progress
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Completed</span>
                  <span>25%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ───────────── UPDATE DIALOG ───────────── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={updateLessonHandler} className="space-y-6">
            <DialogTitle>Update Lesson</DialogTitle>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={selectedCourseId || ""}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="border rounded-xl py-2 px-3 w-full"
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

              <div className="grid gap-2">
                <Label htmlFor="chapter">Chapter</Label>
                <select
                  id="chapter"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="border rounded-xl py-2 px-3 w-full"
                  required
                >
                  <option value="">-- Choose Chapter --</option>
                  {chapters
                    ?.filter((c) => c.courseId.toString() === selectedCourseId)
                    .map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.chapterTitle}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={updateState.loading}>
                {updateState.loading ? <Spinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ───────────── DELETE DIALOG ───────────── */}
      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={setIsDeletedDailogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Are you sure to delete this lesson?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-4 mt-6">
            <AlertDialogCancel className="px-6 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              onClick={deleteLessonHandler}
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
