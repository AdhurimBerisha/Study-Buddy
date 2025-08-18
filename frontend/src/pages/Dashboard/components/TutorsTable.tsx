import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  deleteTutor,
  setShowEditTutorForm,
} from "../../../store/slice/adminSlice";

const TutorsTable = () => {
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
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-300 to-pink-400 dark:from-purple-600 dark:to-pink-700 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading tutors...
        </p>
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-300 to-pink-400 dark:from-purple-600 dark:to-pink-700 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          No tutors found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Create your first tutor account to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/30">
      <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
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
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tutors List
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
          <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Tutor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Expertise
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Rate & Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {tutors.map((tutor) => (
              <tr
                key={tutor.id}
                className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {tutor.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-md"
                          src={tutor.avatar}
                          alt={`${tutor.first_name} ${tutor.last_name}`}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 shadow-md">
                          <span className="text-sm font-bold text-white">
                            {tutor.first_name.charAt(0)}
                            {tutor.last_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {tutor.first_name} {tutor.last_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <svg
                          className="w-3 h-3 mr-1"
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
                        ID: {tutor.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3">
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tutor.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tutor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {tutor.expertise.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 shadow-sm">
                        +{tutor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                  {tutor.bio && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {tutor.bio}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {typeof tutor.rating === "number"
                        ? tutor.rating.toFixed(1)
                        : "0.0"}{" "}
                      ★
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        tutor.isVerified
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200"
                          : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900 dark:to-amber-900 dark:text-yellow-200"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 mr-1 ${
                          tutor.isVerified
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {tutor.isVerified ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                      {tutor.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(tutor.id)}
                      title="Edit tutor"
                      className="group relative text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <svg
                        className="h-4 w-4"
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
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        Edit Tutor
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleDelete(tutor.id)}
                      disabled={deletingTutorId === tutor.id}
                      title="Delete tutor"
                      className="group relative text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingTutorId === tutor.id ? (
                        <div className="flex items-center space-x-1">
                          <svg
                            className="animate-spin h-4 w-4"
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
                          <span className="text-xs">Deleting...</span>
                        </div>
                      ) : (
                        <svg
                          className="h-4 w-4"
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
                      )}
                      {deletingTutorId !== tutor.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Delete Tutor
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorsTable;
