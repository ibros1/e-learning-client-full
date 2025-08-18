import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ImagePlus,
  BadgeDollarSign,
  BookOpen,
  Youtube,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";

import { type AppDispatch, type RootState } from "../../../store/store";
import {
  createCourseFn,
  resetCreateCourseState,
} from "../../../store/slices/courses/createCourse";
import {
  createCourseRedu,
  listCoursesFn,
} from "../../../store/slices/courses/listCourse";

const CreateCourseDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector(
    (state: RootState) => state.createCourseSlice
  );
  const [isOpen, setIsOpen] = useState(false);
  const [courseImgPreview, setCourseImgPreview] = useState<string | null>(null);
  const [coverImgPreview, setCoverImgPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      preview_course: "",
      isPublished: false,
      price: 0,
      course_img: null as File | null,
      cover_img: null as File | null,
    },
    validationSchema: yup.object({
      title: yup.string().required("Course title is required").min(4),
      description: yup.string().required("Description is required"),
      course_img: yup.mixed().required("Course image is required"),
      cover_img: yup.mixed().required("Cover image is required"),
      preview_course: yup
        .string()
        .url("Must be a valid URL")
        .required("Preview link is required"),
      price: yup.number().min(0, "Price must be positive"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("isPublished", values.isPublished.toString());
      formData.append("preview_course", values.preview_course);

      if (values.course_img) {
        formData.append("course_img", values.course_img);
      }
      if (values.cover_img) {
        formData.append("cover_img", values.cover_img);
      }

      dispatch(createCourseFn(formData));
    },
  });

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error);
      return;
    }

    if (loading) {
      toast.dismiss();
      const toastId = toast.loading("Creating course...");
      return () => toast.dismiss(toastId);
    }

    if (data?.isSuccess) {
      toast.success("Course created successfully!");
      dispatch(createCourseRedu(data.course));
      formik.resetForm();
      setCourseImgPreview(null);
      setCoverImgPreview(null);
      setIsOpen(false);
      dispatch(listCoursesFn());
      dispatch(resetCreateCourseState());
    }
  }, [loading, error, data, dispatch]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "course_img" | "cover_img",
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue(field, file);
      previewSetter(URL.createObjectURL(file));
      formik.setFieldTouched(field, true);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setCourseImgPreview(null);
    setCoverImgPreview(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-slate-800 hover:bg-slate-700 transition duration-300 px-6 py-4 rounded-xl text-white"
          onClick={() => setIsOpen(true)}
        >
          <span className="font-semibold  dark:text-white">Create Course</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-[#091025] dark:text-white overflow-auto rounded-xl max-w-3xl h-full max-h-[90%] p-6 md:p-8  border bg-background shadow-2xl">
        <div className="absolute top-4 right-4">
          <DialogClose onClick={handleCancel}></DialogClose>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-black dark:text-white  ">
            📘 Create New Course
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="grid gap-6 mt-6"
          encType="multipart/form-data"
        >
          {/* Title & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="title"
                className="flex items-center gap-1 mb-2 font-medium"
              >
                <BookOpen size={16} className="text-blue-600" />
                Course Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Advanced React Patterns"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="price"
                className="flex items-center gap-1 mb-2 font-medium"
              >
                <BadgeDollarSign size={16} className="text-green-600" />
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.price}
                </p>
              )}
            </div>
          </div>

          {/* Course & Cover Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <Label
                htmlFor="course_img"
                className="flex items-center gap-1 mb-2 font-medium"
              >
                <ImagePlus size={16} className="text-purple-600" />
                Course Image
              </Label>

              {courseImgPreview ? (
                <div className="relative group  ">
                  <img
                    src={courseImgPreview}
                    alt="Course preview"
                    className="w-full dark:bg-[#091025] h-48 object-cover rounded-xl border shadow-sm mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("course_img", null);
                      setCourseImgPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="course_img"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud size={24} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
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
                        handleImageChange(e, "course_img", setCourseImgPreview)
                      }
                    />
                  </label>
                </div>
              )}

              {formik.touched.course_img && formik.errors.course_img && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.course_img}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="cover_img"
                className="flex items-center gap-1 mb-2 font-medium"
              >
                <UploadCloud size={16} className="text-indigo-600" />
                Cover Image
              </Label>

              {coverImgPreview ? (
                <div className="relative group">
                  <img
                    src={coverImgPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-xl border shadow-sm mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("cover_img", null);
                      setCoverImgPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="cover_img"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud size={24} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
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
                        handleImageChange(e, "cover_img", setCoverImgPreview)
                      }
                    />
                  </label>
                </div>
              )}

              {formik.touched.cover_img && formik.errors.cover_img && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.cover_img}
                </p>
              )}
            </div>
          </div>

          {/* Preview Link */}
          <div>
            <Label
              htmlFor="preview_course"
              className="flex items-center gap-1 mb-2 font-medium"
            >
              <Youtube size={16} className="text-red-600" />
              Preview Link
            </Label>
            <Input
              id="preview_course"
              name="preview_course"
              placeholder="https://youtube.com/embed/..."
              value={formik.values.preview_course}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.preview_course && formik.errors.preview_course && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.preview_course}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe what students will learn in this course..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Publish Switch */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#0f172d] rounded-xl">
            <Switch
              id="isPublished"
              checked={formik.values.isPublished}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isPublished", checked)
              }
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="isPublished" className="font-medium">
              Publish Immediately
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-medium shadow hover:shadow-md transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseDialog;
