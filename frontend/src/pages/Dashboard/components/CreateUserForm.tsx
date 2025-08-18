import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  createUser,
  setShowCreateUserForm,
} from "../../../store/slice/adminSlice";

const CreateUserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { creatingUser } = useSelector((state: RootState) => state.admin);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    role: "user" as "user" | "tutor" | "admin",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      return;
    }

    try {
      await dispatch(createUser(formData)).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setShowCreateUserForm(false));
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
              Create New User
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a new user to the platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avatar: e.target.value,
                  })
                }
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "user" | "tutor" | "admin",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
              >
                <option value="user">User</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingUser}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {creatingUser ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span>Creating...</span>
                </div>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
