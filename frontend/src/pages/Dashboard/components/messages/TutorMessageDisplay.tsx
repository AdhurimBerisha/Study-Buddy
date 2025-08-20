import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { clearMessage } from "../../../../store/slice/tutorSlice";

const TutorMessageDisplay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const message = useSelector((state: RootState) => state.tutor.message);

  if (!message) return null;

  const isError =
    message.toLowerCase().includes("error") ||
    message.toLowerCase().includes("failed");

  return (
    <div className="mb-6">
      <div
        className={`rounded-lg p-4 ${
          isError
            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 w-5 h-5 ${
                isError ? "text-red-400" : "text-green-400"
              }`}
            >
              {isError ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  isError
                    ? "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearMessage())}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 ${
              isError
                ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isError
                ? "focus:ring-red-500 dark:focus:ring-red-400"
                : "focus:ring-green-500 dark:focus:ring-green-400"
            }`}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorMessageDisplay;
