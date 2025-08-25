import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import type { AppDispatch, RootState } from "../../../../store/store";
import { createTutorCourse } from "../../../../store/slice/tutorSlice";
import type { CourseFormData } from "../../types/courseTypes";
import {
  InputField,
  SelectField,
  TextAreaField,
  LessonFields,
} from "./CourseFormParts";
import { categories } from "../../constants/courseFormConstants";
import { AiOutlinePlus, AiOutlineLoading3Quarters } from "react-icons/ai";

const defaultValues: CourseFormData = {
  title: "",
  description: "",
  category: "",

  level: "beginner",
  price: 0,
  thumbnail: "",
  lessons: [
    { title: "", content: "", order: 1, duration: undefined, resources: "" },
  ],
};

const CreateCourseForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { creatingCourse, courseError } = useSelector(
    (state: RootState) => state.tutor
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CourseFormData>({ defaultValues, mode: "onSubmit" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lessons",
  });

  const addLesson = () =>
    append({
      title: "",
      content: "",
      order: fields.length + 1,
      duration: undefined,
      resources: "",
    });

  const removeLesson = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const onSubmit = async (data: CourseFormData) => {
    const validLessons = data.lessons
      .filter((l) => l.title.trim() && l.content.trim())
      .map((lesson, index) => ({
        title: lesson.title.trim(),
        content: lesson.content.trim(),
        order: index + 1,
        duration:
          typeof lesson.duration === "number" && lesson.duration > 0
            ? lesson.duration
            : undefined,
        resources: lesson.resources?.trim()
          ? lesson.resources.trim()
          : undefined,
      }));

    if (validLessons.length === 0) {
      setError("root.submit", {
        type: "manual",
        message: "At least one lesson with title and content is required",
      });
      return;
    }

    try {
      // Extract file or fallback to string URL
      let thumbnailFile: File | string | null = null;
      if (data.thumbnail && typeof data.thumbnail !== "string") {
        const list = data.thumbnail as FileList;
        if (list.length > 0) thumbnailFile = list[0];
      } else if (typeof data.thumbnail === "string" && data.thumbnail) {
        thumbnailFile = data.thumbnail;
      }

      await dispatch(
        createTutorCourse({
          title: data.title,
          description: data.description,
          category: data.category,
          level: data.level,
          price: data.price,
          thumbnail: thumbnailFile,
          totalLessons: validLessons.length,
          lessons: validLessons,
        })
      ).unwrap();

      alert(`Course created successfully with ${validLessons.length} lessons!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="relative">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Course
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a new course to the platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Course Title *"
                placeholder="Enter course title"
                error={errors.title?.message as string}
                {...register("title", { required: "Title is required" })}
              />

              <SelectField
                label="Category *"
                error={errors.category?.message as string}
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Level *" {...register("level")}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </SelectField>

              <InputField
                label="Price ($)"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                error={String(errors.price?.message || "")}
                {...register("price", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Price cannot be negative" },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("thumbnail")}
                  className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: choose an image to upload. You can still paste a URL
                  in the lessons/resources.
                </p>
              </div>
            </div>

            <TextAreaField
              label="Course Description *"
              rows={4}
              placeholder="Describe your course content, objectives, and what students will learn..."
              error={errors.description?.message as string}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                Course Lessons ({fields.length})
              </h4>
              <button
                type="button"
                onClick={addLesson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <AiOutlinePlus className="w-4 h-4" />
                <span>Add Lesson</span>
              </button>
            </div>

            {fields.map((field, index) => (
              <LessonFields
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                canRemove={fields.length > 1}
                onRemove={removeLesson}
              />
            ))}
          </div>

          {errors.root?.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                {errors.root.submit.message}
              </p>
            </div>
          )}

          {courseError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{courseError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingCourse}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {creatingCourse ? (
                <div className="flex items-center space-x-2">
                  <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  <span>Creating Course...</span>
                </div>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
