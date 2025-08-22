import React from "react";

const PageLoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-neutral-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Loading...
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we prepare your content
        </p>
      </div>
    </div>
  );
};

export default PageLoadingSpinner;
