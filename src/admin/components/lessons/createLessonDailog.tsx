import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import CreateChapters from "../chapters/createChapters";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { listCoursesFn } from "../../../store/slices/courses/listCourse";
import type { Course } from "../../../types/course";
import { AlertDialogHeader } from "../../../components/ui/alert-dialog";
import {
  createlessonFn,
  resetLessonState,
} from "../../../store/slices/lessons/createLesson";
import toast from "react-hot-toast";
import { listLessonsFn } from "../../../store/slices/lessons/listLessons";
const CreateLessonDailog = () => {
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listCoursesFn());
  }, [dispatch]);

  const listCoursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const loginState = useSelector((state: RootState) => state.loginSlice);

  const courses = listCoursesState.data?.courses;
  const createLessonState = useSelector(
    (state: RootState) => state.createLessonSlice
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (createLessonState.error) {
      toast.error(createLessonState.error);
      return;
    }
    if (createLessonState.data?.isSuccess) {
      toast.success("Successfully created Lesson!");
      setIsCreateLessonOpen(false);
      dispatch(listLessonsFn());
      setTitle("");
      setContent("");
      setVideoUrl("");
      setSelectedCourse(null);
      dispatch(resetLessonState());
    }
  }, [createLessonState, dispatch]);

  const createLessonHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedCourse ||
      !selectedChapterId ||
      !title ||
      !content ||
      !videoUrl
    ) {
      console.warn("Missing required fields");
      return;
    }

    dispatch(
      createlessonFn({
        userId: loginState?.data?.user?.id,
        courseId: +selectedCourse?.id,
        chapterId: selectedChapterId,
        title: title,
        content: content,
        video_url: videoUrl,
        isCompleted: false,
      })
    );
  };

  return !loginState.data.isSuccess ? (
    <div className="text-red-600 font-4xl">Please login first</div>
  ) : (
    <div>
      <div className=" gap-4 lg:flex">
        <CreateChapters />
        <Button
          className="bg-black font-bold hover:bg-slate-800"
          onClick={() => setIsCreateLessonOpen(true)}
        >
          Create Lesson
        </Button>
      </div>
      <Dialog open={isCreateLessonOpen} onOpenChange={setIsCreateLessonOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={createLessonHandler}>
            <AlertDialogHeader>
              <DialogTitle>Create new Lesson</DialogTitle>
              <DialogDescription>
                create new lesson for choosing the course and chapter.
              </DialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Course</Label>
                <select
                  name=""
                  id=""
                  className="border rounded-xl py-4"
                  onChange={(e) => {
                    const foundCourse = courses?.find(
                      (course) => course.id.toString() === e.target.value
                    );
                    setSelectedCourse(foundCourse!);
                  }}
                >
                  <option value="" className="text-center">
                    -----Choose Course--------
                  </option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {" "}
                      {course.title.length > 40
                        ? course.title.slice(0, 40) + "..."
                        : course.title}{" "}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 ">
                <Label htmlFor="name-1">Chapter</Label>
                <select
                  name=""
                  id=""
                  className="border rounded-xl py-4"
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                >
                  <option value="" className="text-center">
                    -----Choose Chapter--------
                  </option>
                  {selectedCourse?.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {" "}
                      {console.log(chapter.id)!}
                      {chapter.chapterTitle.length > 30
                        ? chapter.chapterTitle.slice(0, 39) + "..."
                        : chapter.chapterTitle}{" "}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter lesson content"
                  value={content}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="video_url">Video Url</Label>
                <Input
                  type="video_url"
                  placeholder="Enter your embbed link video "
                  onChange={(e) => setVideoUrl(e.target.value)}
                  value={videoUrl}
                ></Input>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateLessonDailog;
