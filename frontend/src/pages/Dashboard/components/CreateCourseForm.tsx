import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import type { AppDispatch, RootState } from "../../../store/store";
import { createCourse } from "../../../store/slice/dashboardSlice";
import type { CourseFormData } from "./courseTypes";
import {
  InputField,
  SelectField,
  TextAreaField,
  LessonFields,
} from "./CourseFormParts";
import { categories, languages } from "./courseFormConstants";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

const defaultValues: CourseFormData = {
  title: "",
  description: "",
  category: "",
  language: "",
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
    (state: RootState) => state.dashboard
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
            : null,
        resources: lesson.resources?.trim() ? lesson.resources.trim() : null,
      }));

    if (validLessons.length === 0) {
      setError("root.submit", {
        type: "manual",
        message: "At least one lesson with title and content is required",
      });
      return;
    }

    try {
      await dispatch(
        createCourse({
          ...data,
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
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4 " onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Course
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build your course with lessons and content
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Course Information
            </h3>

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

              <SelectField
                label="Language *"
                error={errors.language?.message as string}
                {...register("language", { required: "Language is required" })}
              >
                <option value="">Select language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
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

              <InputField
                label="Thumbnail URL"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register("thumbnail")}
              />
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
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Lessons ({fields.length})
              </h3>
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

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingCourse}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
