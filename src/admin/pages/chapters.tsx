import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  Trash2,
  BookOpen,
  Clock,
  GraduationCap,
  BookCopy,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Checkbox } from "../../components/ui/checkbox";

import CreateChapters from "../components/chapters/createChapters";
import ChaptersSkeleton from "../../components/ui/ChaptersSkeleton";
import Spinner from "../../components/spinner";

import type { AppDispatch, RootState } from "../../store/store";
import {
  listChaptersFn,
  updateChapterRedu,
} from "../../store/slices/chapters/listChapters";
import { listCoursesFn } from "../../store/slices/courses/listCourse";
import {
  resetUpdateChapterState,
  updateChapterFn,
} from "../../store/slices/chapters/updateChapter";
import {
  deleteChapterFn,
  resetDeleteChapterState,
} from "../../store/slices/chapters/deleteChapter"; // ✅ fixed import

const Chapters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const didFetch = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({ key: "chapterTitle", direction: "ascending" });

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [courseId, setCourseId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Redux State
  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const courses = coursesState.data?.courses ?? [];

  const listChaptersState = useSelector(
    (state: RootState) => state.listChaptersSlice
  );
  const chapters = listChaptersState.data?.chapters
    ? [...listChaptersState.data.chapters]
    : [];

  const updateChapterState = useSelector(
    (state: RootState) => state.updateChapterSlice
  );
  const deleteChapterState = useSelector(
    (state: RootState) => state.deleteChapterSlice
  );

  // Initial Fetch
  useEffect(() => {
    if (!didFetch.current) {
      dispatch(listChaptersFn());
      dispatch(listCoursesFn());
      didFetch.current = true;
    }
  }, [dispatch]);

  // Update State Handler
  useEffect(() => {
    if (updateChapterState.error) {
      toast.dismiss();
      toast.error(updateChapterState.error);
      setIsEditDialogOpen(false);
      return;
    }
    if (updateChapterState.loading) {
      toast.dismiss();
      toast.loading("Updating....");
      return;
    }

    if (updateChapterState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Chapter updated successfully");
      dispatch(updateChapterRedu(updateChapterState.data.updatedChapter));
      dispatch(listChaptersFn());
      dispatch(resetUpdateChapterState());
      setIsEditDialogOpen(false);
    }
  }, [updateChapterState, dispatch]);

  // Delete State Handler
  useEffect(() => {
    if (deleteChapterState.error) {
      toast.dismiss();
      toast.error(deleteChapterState.error);
      return;
    }
    if (deleteChapterState.loading) {
      toast.dismiss();
      toast.loading("Deleting...");
      return;
    }

    if (deleteChapterState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Chapter(s) deleted successfully!");
      dispatch(listChaptersFn());
      dispatch(resetDeleteChapterState());
      setIsDeleteDialogOpen(false);
      setSelectedIds([]);
    }
  }, [deleteChapterState, dispatch]);

  // Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateChapterFn({
        chapterId: selectedChapterId,
        chapterTitle,
        courseId: +courseId,
      })
    );
  };

  // Delete Submit
  const handleDelete = () => {
    if (selectedIds.length > 0) {
      selectedIds.forEach((id) => dispatch(deleteChapterFn(id)));
    }
  };

  // Select All Handler
  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(filteredAndSortedChapters.map((c) => c.id));
    else setSelectedIds([]);
  };

  // Sort handler
  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort chapters
  const filteredAndSortedChapters = [...chapters] // just copy, no pre-sort
    .filter((chapter) => {
      if (activeTab === "withLessons") return chapter.lesson.length > 0;
      if (activeTab === "withoutLessons") return chapter.lesson.length === 0;
      return true;
    })
    .filter(
      (c) =>
        c.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseId.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortConfig.key === "chapterTitle") {
        return sortConfig.direction === "ascending"
          ? a.chapterTitle.localeCompare(b.chapterTitle)
          : b.chapterTitle.localeCompare(a.chapterTitle);
      }
      if (sortConfig.key === "course") {
        const aCourse = a.courses?.title || "";
        const bCourse = b.courses?.title || "";
        return sortConfig.direction === "ascending"
          ? aCourse.localeCompare(bCourse)
          : bCourse.localeCompare(aCourse);
      }
      if (sortConfig.key === "courseId") {
        const aCourse = a.courseId.toString();
        const bCourse = b.courseId.toString();
        return sortConfig.direction === "ascending"
          ? aCourse.localeCompare(bCourse)
          : bCourse.localeCompare(aCourse);
      }
      if (sortConfig.key === "lessons") {
        return sortConfig.direction === "ascending"
          ? a.lesson.length - b.lesson.length
          : b.lesson.length - a.lesson.length;
      }
      if (sortConfig.key === "created") {
        return sortConfig.direction === "ascending"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  if (listChaptersState.loading) return <ChaptersSkeleton />;

  return (
    <div className="p-6 dark:bg-[#0a1125] min-h-screen text-gray-900 dark:text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Chapters */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-0">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Chapters
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {chapters.length}
            </div>
            <Progress
              value={75}
              className="h-1 mt-2 bg-blue-200 dark:bg-blue-800"
            />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-0">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Total Courses
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {courses.length}
            </div>
            <Progress
              value={60}
              className="h-1 mt-2 bg-purple-200 dark:bg-purple-800"
            />
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Lessons */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-0">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Lessons
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <BookCopy className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {chapters.reduce((acc, c) => acc + c.lesson.length, 0)}
            </div>
            <Progress
              value={85}
              className="h-1 mt-2 bg-green-200 dark:bg-green-800"
            />
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        {/* Avg Lessons/Chapter */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-0">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Avg. Lessons/Chapter
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {chapters.length > 0
                ? (
                    chapters.reduce((acc, c) => acc + c.lesson.length, 0) /
                    chapters.length
                  ).toFixed(1)
                : "0"}
            </div>
            <Progress
              value={70}
              className="h-1 mt-2 bg-amber-200 dark:bg-amber-800"
            />
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chapter Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your course chapters
          </p>
        </div>
        <div className="flex gap-2">
          <CreateChapters />
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 dark:border-gray-600 shadow-sm dark:bg-[#0f1427] border">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search chapters..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setActiveTab("all")}
                  className={activeTab === "all" ? "bg-muted" : ""}
                >
                  All Chapters
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setActiveTab("withLessons")}
                  className={activeTab === "withLessons" ? "bg-muted" : ""}
                >
                  With Lessons
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveTab("withoutLessons")}
                  className={activeTab === "withoutLessons" ? "bg-muted" : ""}
                >
                  Without Lessons
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedIds.length === 0 ? (
              <Button
                variant="destructive"
                className="gap-1 opacity-[0.5] disabled:cursor-no-drop"
                disabled
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chapters Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 w-12">
                <Checkbox
                  checked={
                    selectedIds.length === filteredAndSortedChapters.length &&
                    filteredAndSortedChapters.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("chapterTitle")}
              >
                <div className="flex items-center gap-1">
                  Chapter Title
                  {sortConfig.key === "chapterTitle" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("courseId")}
              >
                <div className="flex items-center gap-1">
                  Course Id
                  {sortConfig.key === "courseId" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("course")}
              >
                <div className="flex items-center gap-1">
                  Course
                  {sortConfig.key === "course" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("lessons")}
              >
                <div className="flex items-center gap-1">
                  Lessons
                  {sortConfig.key === "lessons" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="p-3 text-left">Status</th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => handleSort("created")}
              >
                <div className="flex items-center gap-1">
                  Created
                  {sortConfig.key === "created" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedChapters.map((chapter) => (
              <tr
                key={chapter.id}
                className="border-t border-border hover:bg-muted/30"
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedIds.includes(chapter.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds([...selectedIds, chapter.id]);
                      } else {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== chapter.id)
                        );
                      }
                    }}
                  />
                </td>
                <td className="p-3">{chapter.chapterTitle}</td>
                <td className="p-3">#{chapter.courseId}</td>
                <td className="p-3">{chapter.courses?.title || "-"}</td>
                <td className="p-3">{chapter.lesson.length}</td>
                <td className="p-3">
                  {chapter.lesson.length > 0 ? (
                    <Badge variant="outline">Has Lessons</Badge>
                  ) : (
                    <Badge variant="secondary">No Lessons</Badge>
                  )}
                </td>
                <td className="p-3">
                  {new Date(chapter.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedChapterId(chapter.id);
                      setChapterTitle(chapter.chapterTitle);
                      setCourseId(
                        chapter.courseId ? chapter.courseId.toString() : ""
                      );
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedIds([chapter.id]);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Chapter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              Update chapter title or course
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Chapter Title
              </label>
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:cursor-not-allowed"
                disabled={updateChapterState.loading}
              >
                {updateChapterState.loading ? <Spinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chapters;
