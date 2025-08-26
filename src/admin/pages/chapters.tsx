import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  Trash2,
  Search,
  BookOpen,
  GraduationCap,
  BookCopy,
  Clock,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";

import CreateChapters from "../components/chapters/createChapters";
import ChaptersSkeleton from "../../components/ui/ChaptersSkeleton";

import type { AppDispatch, RootState } from "../../store/store";
import { listChaptersFn } from "../../store/slices/chapters/listChapters";
import { listCoursesFn } from "../../store/slices/courses/listCourse";
import {
  resetUpdateChapterState,
  updateChapterFn,
} from "../../store/slices/chapters/updateChapter";
import {
  deleteChapterFn,
  resetDeleteChapterState,
} from "../../store/slices/chapters/deleteChapter";
import Spinner from "../../components/spinner";

const Chapters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const didFetch = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");

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
  const chapters =
    listChaptersState.data?.chapters
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) ?? [];

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
      toast.error(updateChapterState.error);
      setIsEditDialogOpen(false);
      return;
    }

    if (updateChapterState.data?.isSuccess) {
      toast.success("Chapter updated successfully");
      dispatch(resetUpdateChapterState());
      setIsEditDialogOpen(false);
    }
  }, [updateChapterState, dispatch]);

  // Delete State Handler
  useEffect(() => {
    if (deleteChapterState.error) {
      toast.error(deleteChapterState.error);
      return;
    }

    if (deleteChapterState.data?.isSuccess) {
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
    if (checked) {
      setSelectedIds(chapters.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  if (listChaptersState.loading) {
    return <ChaptersSkeleton />;
  }

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Chapters Dashboard
          </h1>
          <CreateChapters />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="rounded-xl border bg-card dark:bg-[#0f1629] p-4 shadow-sm flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Chapters</p>
              <p className="text-xl font-semibold">{chapters.length}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card dark:bg-[#0f1629] p-4 shadow-sm flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-xl font-semibold">{courses.length}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card dark:bg-[#0f1629] p-4 shadow-sm flex items-center gap-3">
            <BookCopy className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
              <p className="text-xl font-semibold">
                {chapters.reduce((acc, c) => acc + c.lesson.length, 0)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-card dark:bg-[#0f1629] p-4 shadow-sm flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Recently Added</p>
              <p className="text-xl font-semibold">
                {chapters[0]?.chapterTitle ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mt-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search chapters…"
            className="w-full rounded-xl pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Delete Button */}
      <div className="mb-4">
        {selectedIds.length === 0 ? (
          <Button
            className="opacity-[0.5]"
            disabled
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Selected (
            {selectedIds.length})
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Selected (
            {selectedIds.length})
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === chapters.length}
                  onCheckedChange={(val) => toggleSelectAll(!!val)}
                />
              </TableHead>
              <TableHead>Chapter Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters
              .filter(
                (c) =>
                  c.chapterTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  c.courseId.toString().includes(searchTerm) ||
                  c.courses?.title
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(chapter.id)}
                      onCheckedChange={(val) =>
                        setSelectedIds((prev) =>
                          val
                            ? [...prev, chapter.id]
                            : prev.filter((id) => id !== chapter.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {chapter.chapterTitle}
                  </TableCell>
                  <TableCell>{chapter.courses?.title}</TableCell>
                  <TableCell>{chapter.lesson.length} lessons</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(chapter.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(true);
                        setSelectedChapterId(chapter.id);
                        setChapterTitle(chapter.chapterTitle);
                        setCourseId(chapter.courseId.toString());
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setSelectedIds([chapter.id]);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {chapters.filter(
              (c) =>
                c.chapterTitle
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                c.courseId.toString().includes(searchTerm) ||
                c.courses?.title
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No chapters match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-xl dark:bg-[#091025]">
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              Update the details of the selected chapter.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Course
              </label>
              <select
                className="w-full border rounded-lg p-2 bg-white dark:bg-[#0f1629]"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">-- Change Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title.length > 50
                      ? course.title.slice(0, 50) + "..."
                      : course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Chapter Name
              </label>
              <Input
                type="text"
                required
                placeholder="Enter Chapter Title"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-gray-500 disabled:hover:bg-gray-600"
                disabled={updateChapterState.loading}
              >
                {updateChapterState.loading ? <Spinner /> : "Update"}
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
        <AlertDialogContent className="rounded-xl dark:bg-[#091025]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected chapter(s)? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chapters;
