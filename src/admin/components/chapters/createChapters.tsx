import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { type AppDispatch, type RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { listCoursesFn } from "../../../store/slices/courses/listCourse";
import {
  createChapterFn,
  resetChapterState,
} from "../../../store/slices/chapters/createChapter";
import { listChaptersFn } from "../../../store/slices/chapters/listChapters";
import Spinner from "../../../components/spinner";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

// ✅ Schema like CreateLessonDialog
const formSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  chapterName: z.string().min(3, "Chapter name must be at least 3 characters"),
});

const CreateChapters = () => {
  const dispatch = useDispatch<AppDispatch>();

  const listCoursesState = useSelector(
    (state: RootState) => state.listCoursesSlice
  );
  const createChapterState = useSelector(
    (state: RootState) => state.createChapterSlice
  );
  const loginState = useSelector((state: RootState) => state.loginSlice);

  const [isCreateChapterDialogOpen, setIsCreateChapterDialogOpen] =
    useState(false);

  const courses = listCoursesState.data?.courses;
  const userId = loginState.data?.user.id;

  useEffect(() => {
    dispatch(listCoursesFn());
  }, [dispatch]);

  // ✅ Same pattern as CreateLessonDialog
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      chapterName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(
      createChapterFn({
        userId,
        courseId: Number(values.courseId),
        chapterTitle: values.chapterName,
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
      form.reset();
      dispatch(listChaptersFn());
    }
  }, [createChapterState, dispatch, form]);

  return (
    <div>
      <Button
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800"
        onClick={() => setIsCreateChapterDialogOpen(true)}
      >
        <Plus className="w-4 h-4" /> New Chapter
      </Button>

      <Dialog
        open={isCreateChapterDialogOpen}
        onOpenChange={setIsCreateChapterDialogOpen}
      >
        <DialogContent className="sm:max-w-lg rounded-xl dark:bg-[#091025]">
          <DialogHeader>
            <DialogTitle>Create Chapter</DialogTitle>
            <DialogDescription>
              Assign a new chapter to a course.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Course Select */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses?.map((course) => (
                            <SelectItem
                              key={course.id}
                              value={String(course.id)}
                            >
                              {course.title.length > 50
                                ? course.title.slice(0, 50) + "..."
                                : course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chapter Name */}
              <FormField
                control={form.control}
                name="chapterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Chapter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateChapterDialogOpen(false)}
                  disabled={createChapterState.loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createChapterState.loading}
                  className="disabled:bg-gray-700 bg-slate-900 hover:bg-slate-700 disabled:cursor-not-allowed"
                >
                  {createChapterState.loading ? <Spinner /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateChapters;
