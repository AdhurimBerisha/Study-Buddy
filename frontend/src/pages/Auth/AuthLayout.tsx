import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
  linkLabel: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  linkText,
  linkTo,
  linkLabel,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-24">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-gray-600 dark:text-gray-400">
              {linkText}{" "}
              <Link
                to={linkTo}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                {linkLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
