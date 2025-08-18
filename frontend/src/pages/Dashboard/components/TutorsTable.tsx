import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  deleteTutor,
  setShowEditTutorForm,
} from "../../../store/slice/adminSlice";

const TutorsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tutors, deletingTutorId, loadingTutors } = useSelector(
    (state: RootState) => state.admin
  );

  const handleEdit = (tutorId: string) => {
    dispatch(setShowEditTutorForm(tutorId));
  };

  const handleDelete = async (tutorId: string) => {
    if (window.confirm("Are you sure you want to delete this tutor?")) {
      try {
        await dispatch(deleteTutor(tutorId)).unwrap();
      } catch (error) {
        console.error("Failed to delete tutor:", error);
      }
    }
  };

  if (loadingTutors) {
    return (
      <div className="px-6 py-4">
        <div className="text-center py-4">Loading tutors...</div>
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="px-6 py-4">
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No tutors found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tutor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Expertise
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Rate & Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {tutors.map((tutor) => (
            <tr
              key={tutor.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {tutor.user.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={tutor.user.avatar}
                        alt={`${tutor.user.firstName} ${tutor.user.lastName}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {tutor.user.firstName.charAt(0)}
                          {tutor.user.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {tutor.user.firstName} {tutor.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {tutor.id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {tutor.user.email}
                </div>
                {tutor.user.phone && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {tutor.user.phone}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {tutor.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {tutor.expertise.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      +{tutor.expertise.length - 3} more
                    </span>
                  )}
                </div>
                {tutor.bio && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                    {tutor.bio}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  ${tutor.hourlyRate}/hr
                </div>
                <div className="text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tutor.isVerified
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {tutor.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tutor.id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tutor.id)}
                    disabled={deletingTutorId === tutor.id}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {deletingTutorId === tutor.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TutorsTable;
