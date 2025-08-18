import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { changeUserRole, deleteUser } from "../../../store/slice/adminSlice";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: string;
}

const UsersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, deletingUserId } = useSelector(
    (state: RootState) => state.admin
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await dispatch(changeUserRole({ userId, role })).unwrap();
    } catch (error) {
      console.error("Failed to change user role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
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
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : user.role === "tutor"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {/* Role Change Buttons */}
                {user.role !== "admin" && (
                  <button
                    onClick={() => handleChangeRole(user.id, "admin")}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Make Admin
                  </button>
                )}
                {user.role !== "tutor" && (
                  <button
                    onClick={() => handleChangeRole(user.id, "tutor")}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Make Tutor
                  </button>
                )}
                {user.role !== "user" && (
                  <button
                    onClick={() => handleChangeRole(user.id, "user")}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Make User
                  </button>
                )}

                {/* Delete Button */}
                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingUserId === user.id}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
