import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  fetchDashboardStats,
  fetchUsers,
  fetchCourses,
  fetchTutors,
  setShowCreateUserForm,
  setShowCreateCourseForm,
  setShowEditCourseForm,
  setShowCreateTutorForm,
  setShowEditTutorForm,
  clearMessage,
} from "../../store/slice/adminSlice";
import DashboardStats from "./components/DashboardStats";
import CreateUserForm from "./components/CreateUserForm";
import CreateCourseForm from "./components/CreateCourseForm";
import EditCourseForm from "./components/EditCourseForm";
import CreateTutorForm from "./components/CreateTutorForm";
import EditTutorForm from "./components/EditTutorForm";
import UsersTable from "./components/UsersTable";
import CoursesTable from "./components/CoursesTable";
import TutorsTable from "./components/TutorsTable";
import MessageDisplay from "./components/MessageDisplay";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stats,
    loadingStats,
    showCreateUserForm,
    showCreateCourseForm,
    showEditCourseForm,
    showCreateTutorForm,
    showEditTutorForm,
    message,
  } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUsers());
    dispatch(fetchCourses());
    dispatch(fetchTutors());
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage regular users, tutors, courses, and platform statistics
          </p>
        </div>

        <MessageDisplay />

        <div className="space-y-8">
          <DashboardStats stats={stats} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Regular Users
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage regular user accounts (role: user)
                </p>
              </div>
              <button
                onClick={() =>
                  dispatch(setShowCreateUserForm(!showCreateUserForm))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {showCreateUserForm ? "Cancel" : "Create New User"}
              </button>
            </div>

            {showCreateUserForm && <CreateUserForm />}

            <UsersTable />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Course Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage all courses and their content
                </p>
              </div>
              <button
                onClick={() =>
                  dispatch(setShowCreateCourseForm(!showCreateCourseForm))
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                {showCreateCourseForm ? "Cancel" : "Create New Course"}
              </button>
            </div>

            {showCreateCourseForm && <CreateCourseForm />}

            {showEditCourseForm && (
              <EditCourseForm courseId={showEditCourseForm} />
            )}

            <CoursesTable />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tutor Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage tutor accounts and profiles (role: tutor)
                </p>
              </div>
              <button
                onClick={() =>
                  dispatch(setShowCreateTutorForm(!showCreateTutorForm))
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                {showCreateTutorForm ? "Cancel" : "Create New Tutor"}
              </button>
            </div>

            {showCreateTutorForm && <CreateTutorForm />}

            {showEditTutorForm && <EditTutorForm tutorId={showEditTutorForm} />}

            <TutorsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
