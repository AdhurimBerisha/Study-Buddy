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
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              {linkText}{" "}
              <Link
                to={linkTo}
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
              >
                {linkLabel}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white hover:text-blue-200 text-sm transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
