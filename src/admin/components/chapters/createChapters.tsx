import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../../components/ui/dialog";
import { AlertDialogHeader } from "../../../components/ui/alert-dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

import { type AppDispatch, type RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { listCoursesFn } from "../../../store/slices/courses/listCourse";
import {
  createChapterFn,
  resetChapterState,
} from "../../../store/slices/chapters/createChapter";
import toast from "react-hot-toast";
import { listChaptersFn } from "../../../store/slices/chapters/listChapters";

// Dummy course data (bedel markaas later API call kaaga)

const CreateChapters = () => {
  // const courses = [
  //   { id: 1, title: "React Basics" },
  //   { id: 2, title: "Advanced Node.js" },
  //   { id: 3, title: "UI/UX Design" },
  // ];

  const dispatch = useDispatch<AppDispatch>();

  const listCoursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );

  const createChapterState = useSelector(
    (state: RootState) => state.createChapterSlice
  );

  const loginState = useSelector((state: RootState) => state.loginSlice);
  useEffect(() => {
    dispatch(listCoursesFn());
  }, [dispatch]);

  const courses = listCoursesState.data?.courses;
  const userId = loginState.data?.user.id;
  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] =
    useState(false);

  const [getCourseId, setGetCourseId] = useState("");
  const [chapterName, setChapterName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");
    dispatch(
      createChapterFn({
        userId: userId,
        courseId: Number(getCourseId),
        chapterTitle: chapterName,
      })
    );
  };

  useEffect(() => {
    if (createChapterState.error) {
      toast.error(createChapterState.error);
      return;
    }

    if (createChapterState.data?.createdChapter) {
      toast.success("Successfully created chapter!");
      dispatch(resetChapterState());

      setIsCreateChapterDialogOpen(false);
      setGetCourseId("");
      setChapterName("");
      dispatch(listChaptersFn());
    }
  }, [createChapterState, dispatch]);

  return (
    <div>
      <Button
        className="bg-black font-bold hover:bg-slate-800"
        onClick={() => setIsCreateChapterDialogOpen(true)}
      >
        Create Chapter
      </Button>

      <Dialog
        open={isCreateChapterDialogOpen}
        onOpenChange={setIsCreateChapterDialogOpen}
      >
        <DialogContent>
          <form onSubmit={handleSubmit} className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Create Chapter</DialogTitle>
              <DialogDescription>
                You have to create every course a chapter.
              </DialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-2">
              {/* Course Select */}
              <div className="grid gap-3 ">
                <Label htmlFor="course">Select Course</Label>
                <select
                  value={getCourseId}
                  className="border-2 p-2 rounded-md"
                  onChange={(e) => setGetCourseId(e.target.value)}
                >
                  <option> -----Choose Course----- </option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title.length > 50
                        ? course.title.slice(0, 50) + "..."
                        : course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Name */}
              <div className="grid gap-3">
                <Label htmlFor="chapterName">Chapter Name</Label>
                <Input
                  type="text"
                  id="chapterName"
                  name="name"
                  required
                  value={chapterName}
                  placeholder="Enter Chapter Title"
                  onChange={(e) => setChapterName(e.target.value)}
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
    </div>
  );
};

export default CreateChapters;
