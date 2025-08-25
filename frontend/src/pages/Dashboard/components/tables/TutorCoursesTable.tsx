import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
import type { AppDispatch } from "../../../../store/store";
import {
  fetchTutorCourses,
  setCoursesPage,
} from "../../../../store/slice/tutorSlice";
import Pagination from "../../../../components/Pagination";
import LazyImage from "../../../../components/LazyImage";
import { lessonAPI } from "../../../../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  totalLessons?: number;
  price: number;
  createdAt: string;
  lessons?: {
    id: string;
    title: string;
    order: number;
    duration?: number;
    content?: string;
    resources?: string;
    isActive: boolean;
  }[];
}

interface LessonFormData {
  title: string;
  content: string;
  duration: number;
  resources: string;
}

interface TutorCoursesTableProps {
  courses: Course[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const TutorCoursesTable = ({
  courses,
  loading,
  pagination,
}: TutorCoursesTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>();

  const handlePageChange = (page: number) => {
    dispatch(setCoursesPage(page));
    dispatch(fetchTutorCourses({ page, limit: pagination.itemsPerPage }));
  };

  const handleEditLesson = (lesson: NonNullable<Course["lessons"]>[0]) => {
    setEditingLesson(lesson.id);
    reset({
      title: lesson.title || "",
      content: lesson.content || "",
      duration: lesson.duration || 0,
      resources: lesson.resources || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    reset();
  };

  const onSubmitEdit = async (data: LessonFormData) => {
    if (!editingLesson) return;

    setIsSubmitting(true);
    try {
      await lessonAPI.editLesson(editingLesson, data);

      {
        setEditingLesson(null);
        reset();
        // Refresh courses to get updated lesson data
        dispatch(
          fetchTutorCourses({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
          })
        );
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert("Error updating lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await lessonAPI.deleteLesson(lessonId);

        {
          // Refresh courses to get updated lesson data
          dispatch(
            fetchTutorCourses({
              page: pagination.currentPage,
              limit: pagination.itemsPerPage,
            })
          );
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        alert("Error deleting lesson");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No courses yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start creating your first course to begin teaching students.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">
              Course
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/12">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
              Lessons
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/12">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/12">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {courses.map((course) => (
            <React.Fragment key={course.id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {course.thumbnail ? (
                      <LazyImage
                        className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                        src={course.thumbnail}
                        alt={course.title}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {course.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.level === "beginner"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : course.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <span>
                      {course.lessons?.length || course.totalLessons || 0}
                    </span>
                    {course.lessons && course.lessons.length > 0 && (
                      <button
                        onClick={() =>
                          setExpandedCourse(
                            course.id === expandedCourse ? null : course.id
                          )
                        }
                        className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-all duration-200 hover:shadow-sm"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              course.id === expandedCourse
                                ? "M5 15l7-7 7 7"
                                : "M19 9l-7 7-7-7"
                            }
                          />
                        </svg>
                        <span>
                          {course.id === expandedCourse ? "Hide" : "Show"}{" "}
                          lessons
                        </span>
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(course.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(course.createdAt)}
                </td>
              </tr>
              {expandedCourse === course.id &&
                course.lessons &&
                course.lessons.length > 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Course Lessons:
                        </h4>
                        <div className="grid gap-3">
                          {course.lessons.map((lesson) => (
                            <div key={lesson.id}>
                              {editingLesson === lesson.id ? (
                                // Edit Form
                                <form
                                  onSubmit={handleSubmit(onSubmitEdit)}
                                  className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg space-y-4"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <h5 className="text-base font-semibold text-gray-900 dark:text-white">
                                          Edit Lesson {lesson.order}
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          Update lesson details and content
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-blue-600 dark:text-blue-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                          />
                                        </svg>
                                      </div>
                                      <span>Title *</span>
                                    </label>
                                    <input
                                      type="text"
                                      {...register("title", {
                                        required: "Title is required",
                                      })}
                                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                      placeholder="Enter lesson title"
                                    />
                                    {errors.title && (
                                      <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <span>{errors.title.message}</span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-green-600 dark:text-green-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                      </div>
                                      <span>Content *</span>
                                    </label>
                                    <textarea
                                      {...register("content", {
                                        required: "Content is required",
                                      })}
                                      rows={4}
                                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                                      placeholder="Enter lesson content"
                                    />
                                    {errors.content && (
                                      <p className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <span>{errors.content.message}</span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-purple-600 dark:text-purple-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h6m-6 0H6"
                                          />
                                        </svg>
                                      </div>
                                      <span>Duration (minutes)</span>
                                    </label>
                                    <input
                                      type="number"
                                      {...register("duration", {
                                        valueAsNumber: true,
                                        min: 0,
                                      })}
                                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                                      placeholder="0"
                                      min="0"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      <div className="w-5 h-5 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-orange-600 dark:text-orange-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                          />
                                        </svg>
                                      </div>
                                      <span>Resources</span>
                                    </label>
                                    <textarea
                                      {...register("resources")}
                                      rows={2}
                                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                                      placeholder="Additional resources (optional)"
                                    />
                                  </div>

                                  <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:shadow-md"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <svg
                                            className="w-4 h-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth="4"
                                            ></circle>
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                          </svg>
                                          <span>Saving...</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                          <span>Save Changes</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                // Lesson Display
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {lesson.order}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                          {lesson.title}
                                        </h4>
                                        {lesson.duration && (
                                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                            <svg
                                              className="w-3 h-3"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            <span>
                                              {lesson.duration} minutes
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditLesson(lesson)}
                                      className="px-3 py-2 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:shadow-md flex items-center space-x-1"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteLesson(lesson.id)
                                      }
                                      className="px-3 py-2 text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 hover:shadow-md flex items-center space-x-1"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {(() => {
        const hasMultiplePages = pagination.totalPages > 1;
        const hasMultipleItems =
          pagination.totalItems > pagination.itemsPerPage;
        const hasEnoughData = courses.length >= pagination.itemsPerPage;
        const shouldShowPagination =
          hasMultiplePages && hasMultipleItems && hasEnoughData;

        return shouldShowPagination ? (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        ) : null;
      })()}
    </div>
  );
};

export default TutorCoursesTable;
