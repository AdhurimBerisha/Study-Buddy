import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../../../store/store";
import {
  updateCourse,
  setShowEditCourseForm,
} from "../../../../store/slice/adminSlice";
import api from "../../../../services/api";
import { InputField, SelectField, TextAreaField } from "./CourseFormParts";
import { categories } from "../../constants/courseFormConstants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Tutor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface EditCourseFormProps {
  courseId: string;
  loadingTutors: boolean;
  tutors: Tutor[];
}

interface EditCourseFormValues {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  totalLessons: number;
  tutorId: string;
}

const defaultValues: EditCourseFormValues = {
  title: "",
  description: "",
  category: "",
  level: "",
  price: 0,
  thumbnail: "",
  totalLessons: 0,
  tutorId: "",
};

const EditCourseForm = ({
  courseId,
  loadingTutors,
  tutors,
}: EditCourseFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updatingCourse } = useSelector((state: RootState) => state.admin);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCourseFormValues>({ defaultValues, mode: "onSubmit" });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/admin/courses/${courseId}`);
        const course = response.data.data;
        const values: EditCourseFormValues = {
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",

          level: course.level || "",
          price: typeof course.price === "number" ? course.price : 0,
          thumbnail: course.thumbnail || "",
          totalLessons:
            typeof course.totalLessons === "number" ? course.totalLessons : 0,
          tutorId: course.tutorId || "",
        };
        reset(values);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, reset]);

  const onSubmit = async (data: EditCourseFormValues) => {
    try {
      await dispatch(updateCourse({ courseId, courseData: data })).unwrap();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setShowEditCourseForm(null));
  };

  if (loading) {
    return (
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="text-center py-4">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Title *"
            placeholder="Enter course title"
            error={errors.title?.message as string}
            {...register("title", { required: "Title is required" })}
          />

          <SelectField
            label="Category *"
            error={errors.category?.message as string}
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Level *"
            error={errors.level?.message as string}
            {...register("level", { required: "Level is required" })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </SelectField>

          <InputField
            label="Price"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message as string}
            {...register("price", {
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
            })}
          />

          <InputField
            label="Total Lessons"
            type="number"
            min={0}
            placeholder="0"
            error={errors.totalLessons?.message as string}
            {...register("totalLessons", {
              valueAsNumber: true,
              min: { value: 0, message: "Total lessons cannot be negative" },
            })}
          />

          <InputField
            label="Thumbnail URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("thumbnail")}
          />

          <SelectField
            label="Tutor *"
            error={errors.tutorId?.message as string}
            {...register("tutorId", { required: "Tutor is required" })}
          >
            <option value="">Select Tutor</option>
            {loadingTutors ? (
              <option disabled>Loading Tutors...</option>
            ) : tutors && tutors.length > 0 ? (
              tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.first_name} {tutor.last_name} ({tutor.email})
                </option>
              ))
            ) : (
              <option disabled>No Tutors Available</option>
            )}
          </SelectField>
          {!loadingTutors && tutors && tutors.length === 0 && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400 md:col-span-2">
              No tutors available. Please create tutor accounts first.
            </div>
          )}
        </div>

        <TextAreaField
          label="Description *"
          rows={3}
          placeholder="Enter course description"
          error={errors.description?.message as string}
          {...register("description", { required: "Description is required" })}
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatingCourse}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {updatingCourse ? (
              <span className="inline-flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2" />{" "}
                Updating...
              </span>
            ) : (
              "Update Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
