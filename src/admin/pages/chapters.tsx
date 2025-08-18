import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { listChaptersFn } from "../../store/slices/chapters/listChapters";
import CreateChapters from "../components/chapters/createChapters";
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
import { listCoursesFn } from "../../store/slices/courses/listCourse";
import {
  resetUpdateChapterState,
  updateChapterFn,
} from "../../store/slices/chapters/updateChapter";
import toast from "react-hot-toast";
import {
  deleteChapterFn,
  resetDeleteChapterState,
} from "../../store/slices/chapters/deleteChapter";

const Chapters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(listChaptersFn());
    dispatch(listCoursesFn());
  }, [dispatch]);

  const coursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const updateChapterState = useSelector(
    (state: RootState) => state.updateChapterSlice
  );
  useEffect(() => {
    if (updateChapterState.error) {
      toast.error(updateChapterState.error);
      setIsEditDialogOpen(false);
      return;
    }

    if (updateChapterState.data?.isSuccess) {
      toast.success("Updated Chapter Success");
      dispatch(resetUpdateChapterState());
      dispatch(listChaptersFn());
      setIsEditDialogOpen(false);
      return;
    }
  }, [updateChapterState, dispatch]);
  const courses = coursesState.data?.courses;

  const listChaptersState = useSelector(
    (state: RootState) => state.listChaptersSlice
  );
  const chapters = listChaptersState.data?.chapters
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  // update chapter
  const [selectedChapterbyId, setselectedChapterbyId] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  const chapterId = selectedChapterbyId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateChapterFn({
        chapterId: chapterId,
        chapterTitle: chapterTitle,
        courseId: +courseId,
      })
    );
  };

  // delete handler
  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);

  const deleteChapterHandler = () => {
    dispatch(deleteChapterFn(chapterId));
  };
  const deleteChapterState = useSelector(
    (state: RootState) => state.deleteChapterSlice
  );

  useEffect(() => {
    if (deleteChapterState.error) {
      toast.error(deleteChapterState.error);
      return;
    }

    if (deleteChapterState.data.isSuccess) {
      toast.success("Successfully Deleted chapter!");
      dispatch(listChaptersFn());
      dispatch(resetDeleteChapterState());
      return;
    }
  }, [deleteChapterState, dispatch]);

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      <div className="flex flex-col gap-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:items-center ">
          <h1 className="text-3xl font-bold tracking-tight">
            Chapters Dashboard
          </h1>
          <CreateChapters />
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons…"
            className="w-full rounded-xl px-10 py-3 border border-input bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted/50">
            <tr className="text-sm font-semibold text-muted-foreground uppercase">
              <th className="px-4 py-3 whitespace-nowrap">#</th>
              <th className="px-4 py-3">Chapter_Title</th>
              <th className="px-4 py-3">Course ID</th>
              <th className="px-4 py-3">Course_Title</th>
              <th className="px-4 py-3">Lessons</th>

              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {chapters
              ?.filter((c) => {
                return (
                  c.chapterTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  c.courseId.toString().includes(searchTerm) ||
                  c.courses?.title
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                );
              })
              .map((chapter) => (
                <tr className="hover:bg-muted transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    #{chapter.id}{" "}
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate">
                    {" "}
                    {chapter.chapterTitle}{" "}
                  </td>
                  <td className="px-4 py-3 max-w-[240px] truncate">
                    {" "}
                    {chapter.courseId}{" "}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {" "}
                    {chapter.courses?.title}{" "}
                  </td>
                  <td className="px-4 py-3 max-w-[160px] truncate">
                    {" "}
                    {chapter.lesson.length} lessons
                  </td>

                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {" "}
                    {new Date(chapter.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}{" "}
                  </td>

                  <td className="px-4 py-3 text-center whitespace-nowrap space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(true);
                        setselectedChapterbyId(chapter.id);

                        setChapterTitle(chapter.chapterTitle);
                        setCourseId(chapter.courseId.toString());
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

                        setselectedChapterbyId(chapter.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

            {/* Show message if no chapters found */}
            {chapters?.filter(
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Edit Chapter</DialogTitle>
              <DialogDescription>
                You can edit the selected chapter below.
              </DialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-3">
                <Label htmlFor="course">Select Course</Label>
                <select
                  className="border-2 p-2 rounded-md"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option>----- Change Course -----</option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title.length > 50
                        ? course.title.slice(0, 50) + "...."
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
                  name="name"
                  required
                  placeholder="Enter Chapter Title"
                  value={
                    chapterTitle.length > 35
                      ? chapterTitle.slice(0, 35) + "..."
                      : chapterTitle
                  }
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
      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={setIsDeletedDailogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Are you absolutely sure to delete this chapter?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              chapter and also lessons of that chapter! and remove it from the
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-4">
            <AlertDialogCancel className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteChapterHandler}
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

export default Chapters;
