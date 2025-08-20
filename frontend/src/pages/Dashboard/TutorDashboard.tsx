import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchTutorDashboardStats,
  fetchTutorCourses,
  setShowCreateCourseForm,
  clearMessage,
} from "../../store/slice/tutorSlice";
import TutorDashboardStats from "./components/TutorDashboardStats";
import CreateCourseForm from "./components/CreateCourseForm";
import TutorCoursesTable from "./components/TutorCoursesTable";
import TutorMessageDisplay from "./components/TutorMessageDisplay";

const TutorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stats,
    loadingStats,
    courses,
    loadingCourses,
    showCreateCourseForm,
    message,
    coursesPagination,
  } = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    dispatch(fetchTutorDashboardStats());
    dispatch(fetchTutorCourses({ page: 1, limit: 5 }));
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent dark:from-white dark:via-green-200 dark:to-emerald-200">
            Tutor Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your courses, track student progress, and monitor your
            teaching performance
          </p>
        </div>

        <TutorMessageDisplay />

        <div className="space-y-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
              <TutorDashboardStats stats={stats} />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Course Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create and manage your courses
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    dispatch(setShowCreateCourseForm(!showCreateCourseForm))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  <span>
                    {showCreateCourseForm ? "Cancel" : "Create New Course"}
                  </span>
                </button>
              </div>

              {showCreateCourseForm && (
                <CreateCourseForm
                  onClose={() => dispatch(setShowCreateCourseForm(false))}
                  onSuccess={() => {
                    dispatch(fetchTutorCourses({ page: 1, limit: 5 }));
                    dispatch(fetchTutorDashboardStats());
                  }}
                />
              )}

              <TutorCoursesTable
                courses={courses}
                loading={loadingCourses}
                pagination={coursesPagination}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
