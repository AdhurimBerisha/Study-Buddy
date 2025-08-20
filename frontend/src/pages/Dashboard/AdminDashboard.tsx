import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchDashboardStats,
  fetchUsers,
  fetchCourses,
  fetchTutors,
  setShowCreateUserForm,
  setShowCreateTutorForm,
  clearMessage,
} from "../../store/slice/adminSlice";
import DashboardStats from "./components/DashboardStats";
import CreateUserForm from "./components/CreateUserForm";

import EditCourseForm from "./components/EditCourseForm";
import CreateTutorForm from "./components/CreateTutorForm";
import EditTutorForm from "./components/EditTutorForm";
import UsersTable from "./components/UsersTable";
import CoursesTable from "./components/CoursesTable";
import TutorsTable from "./components/TutorsTable";
import MessageDisplay from "./components/MessageDisplay";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stats,
    loadingStats,
    showCreateUserForm,

    showEditCourseForm,
    showCreateTutorForm,
    showEditTutorForm,
    message,
    loadingTutors,
    tutors,
  } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUsers({ page: 1, limit: 5 }));
    dispatch(fetchCourses({ page: 1, limit: 5 }));
    dispatch(fetchTutors({ page: 1, limit: 5 }));
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-indigo-200">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage regular users, tutors, courses, and platform statistics with
            powerful admin tools
          </p>
        </div>

        <MessageDisplay />

        <div className="space-y-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
              <DashboardStats stats={stats} />
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Regular Users
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage student and learner accounts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    dispatch(setShowCreateUserForm(!showCreateUserForm))
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
                    {showCreateUserForm ? "Cancel" : "Create New User"}
                  </span>
                </button>
              </div>

              {showCreateUserForm && <CreateUserForm />}
              <UsersTable />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-800/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
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
                      View, edit, and delete existing courses
                    </p>
                  </div>
                </div>
              </div>

              {showEditCourseForm && (
                <EditCourseForm
                  courseId={showEditCourseForm}
                  loadingTutors={loadingTutors}
                  tutors={tutors}
                />
              )}
              <CoursesTable />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-violet-800/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Tutor Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage tutor accounts and profiles
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    dispatch(setShowCreateTutorForm(!showCreateTutorForm))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-xl hover:from-purple-700 hover:to-violet-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center space-x-2"
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
                    {showCreateTutorForm ? "Cancel" : "Create New Tutor"}
                  </span>
                </button>
              </div>

              {showCreateTutorForm && <CreateTutorForm />}
              {showEditTutorForm && (
                <EditTutorForm tutorId={showEditTutorForm} />
              )}
              <TutorsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
