import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { deleteCourse, setShowEditCourseForm } from "../../../store/slice/adminSlice";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  language?: string;
  thumbnail?: string;
  totalLessons?: number;
  tutorId?: string;
  createdAt: string;
  tutor?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

const CoursesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, updatingCourse, deletingCourseId } = useSelector((state: RootState) => state.admin);

  const handleEditCourse = (course: Course) => {
    dispatch(setShowEditCourseForm(course.id));
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await dispatch(deleteCourse(courseId)).unwrap();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No courses found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Course
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tutor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {course.thumbnail ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={course.thumbnail}
                        alt={course.title}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {course.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {course.description}
                    </div>
                    {course.totalLessons && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {course.totalLessons} lessons
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {course.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    course.level === "beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : course.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : course.level === "advanced"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {course.level}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.tutor ? (
                  <div className="text-sm text-gray-900 dark:text-white">
                    {course.tutor.user.firstName} {course.tutor.user.lastName}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No tutor assigned
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(course.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEditCourse(course)}
                  disabled={updatingCourse}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  disabled={deletingCourseId === course.id}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingCourseId === course.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursesTable;
