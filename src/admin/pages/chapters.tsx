import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
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

import ChaptersSkeleton from "../../components/ui/ChaptersSkeleton";
import CreateChapters from "../components/chapters/createChapters";

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

const Chapters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const didFetch = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");

  // --- Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [courseId, setCourseId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  // --- Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // --- Redux State
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

  // --- Initial Fetch
  useEffect(() => {
    if (!didFetch.current) {
      dispatch(listChaptersFn());
      dispatch(listCoursesFn());
      didFetch.current = true;
    }
  }, [dispatch]);

  // --- Handle Update State
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

  // --- Handle Delete State
  useEffect(() => {
    if (deleteChapterState.error) {
      toast.error(deleteChapterState.error);
      return;
    }

    if (deleteChapterState.data?.isSuccess) {
      toast.success("Chapter deleted successfully!");
      dispatch(listChaptersFn());
      dispatch(resetDeleteChapterState());
      setIsDeleteDialogOpen(false);
    }
  }, [deleteChapterState, dispatch]);

  // --- Submit Edit
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

  // --- Submit Delete
  const handleDelete = () => {
    if (selectedChapterId) {
      dispatch(deleteChapterFn(selectedChapterId));
    }
  };

  // --- Loading State
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

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chapters…"
            className="w-full rounded-xl px-10 py-3 border border-input bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted/50">
            <tr className="text-sm font-semibold text-muted-foreground uppercase">
              <th className="px-4 py-3">Chapter Title</th>
              <th className="px-4 py-3">Course ID</th>
              <th className="px-4 py-3">Course Title</th>
              <th className="px-4 py-3">Lessons</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
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
                <tr
                  key={chapter.id}
                  className="hover:bg-muted transition-colors"
                >
                  <td className="px-4 py-3 max-w-[180px] truncate">
                    {chapter.chapterTitle}
                  </td>
                  <td className="px-4 py-3">{chapter.courseId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {chapter.courses?.title}
                  </td>
                  <td className="px-4 py-3">{chapter.lesson.length} lessons</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(chapter.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
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
                        setSelectedChapterId(chapter.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}

            {/* Empty State */}
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
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No chapters match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit} className="sm:max-w-[425px]">
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              You can edit the selected chapter below.
            </DialogDescription>

            <div className="grid gap-4 py-2">
              <div className="grid gap-3">
                <Label htmlFor="course">Select Course</Label>
                <select
                  className="border-2 p-2 rounded-md"
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

              <div className="grid gap-3">
                <Label htmlFor="chapterName">Chapter Name</Label>
                <Input
                  type="text"
                  id="chapterName"
                  required
                  placeholder="Enter Chapter Title"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Delete Chapter
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this chapter? This action cannot
              be undone and will also remove all lessons inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <AlertDialogCancel className="rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-lg px-4 py-2 bg-red-600 text-white hover:bg-red-700"
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
