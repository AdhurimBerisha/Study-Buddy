import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  register?: UseFormRegisterReturn;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const FormInput = ({
  label,
  type = "text",
  placeholder,
  required = false,
  error,
  register,
  className = "",
  icon,
  disabled = false,
  size = "md",
}: FormInputProps) => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const iconSizes = {
    sm: "left-3 text-sm",
    md: "left-4 text-lg",
    lg: "left-6 text-xl",
  };

  const paddingWithIcon = {
    sm: "pl-10",
    md: "pl-12",
    lg: "pl-16",
  };

  return (
    <div className={`flex flex-col w-full space-y-2 ${className}`}>
      <label className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizes[size]}`}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          className={`
            w-full border rounded-lg transition-all duration-200
            ${sizes[size]}
            ${icon ? paddingWithIcon[size] : ""}
            text-gray-900 dark:text-gray-100
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-800"
            }
            focus:ring-2 focus:outline-none
            hover:border-gray-400 dark:hover:border-gray-500
            disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50
            placeholder-gray-400 dark:placeholder-gray-500
          `}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs sm:text-sm">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
