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
}: FormInputProps) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="font-semibold text-sm mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className={`
            border rounded-lg px-4 py-3 w-full transition-all duration-200
            ${icon ? "pl-12" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }
            focus:ring-2 focus:outline-none
            hover:border-gray-400
          `}
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
