import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const MessageDisplay = () => {
  const { message } = useSelector((state: RootState) => state.admin);

  if (!message) return null;

  return (
    <div className="mb-8">
      <div
        className={`relative overflow-hidden ${
          message.type === "success"
            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
            : "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
        } px-6 py-4 rounded-2xl shadow-lg`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${
            message.type === "success"
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : "bg-gradient-to-r from-red-400 to-pink-500"
          }`}
        ></div>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {message.type === "success" ? (
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
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
            ) : (
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
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
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
