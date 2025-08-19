import React, { forwardRef } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CourseFormData } from "./courseTypes";

type InputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } dark:bg-gray-700 dark:text-white ${className || ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);
InputField.displayName = "InputField";

type SelectProps = {
  label: string;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;
export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } dark:bg-gray-700 dark:text-white ${className || ""}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);
SelectField.displayName = "SelectField";

type TextAreaProps = {
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <textarea
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } dark:bg-gray-700 dark:text-white ${className || ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);
TextAreaField.displayName = "TextAreaField";

interface LessonFieldsProps {
  index: number;
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  canRemove: boolean;
  onRemove: (index: number) => void;
}

export const LessonFields: React.FC<LessonFieldsProps> = ({
  index,
  register,
  errors,
  canRemove,
  onRemove,
}) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
        Lesson {index + 1}
      </h4>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <InputField
        label="Lesson Title *"
        placeholder="Enter lesson title"
        error={String(errors.lessons?.[index]?.title?.message || "")}
        {...register(`lessons.${index}.title` as const, {
          required: `Lesson ${index + 1} title is required`,
        })}
      />
      <InputField
        label="Duration (minutes)"
        type="number"
        min={1}
        placeholder="e.g., 45"
        error={String(errors.lessons?.[index]?.duration?.message || "")}
        {...register(`lessons.${index}.duration` as const, {
          setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
          validate: (v) =>
            v === undefined ||
            (typeof v === "number" && v > 0) ||
            `Lesson ${index + 1} duration must be positive`,
        })}
      />
    </div>

    <div className="mb-4">
      <TextAreaField
        label="Lesson Content *"
        rows={4}
        placeholder="Enter lesson content, instructions, or description..."
        error={String(errors.lessons?.[index]?.content?.message || "")}
        {...register(`lessons.${index}.content` as const, {
          required: `Lesson ${index + 1} content is required`,
        })}
      />
    </div>

    <TextAreaField
      label="Resources (optional)"
      rows={2}
      placeholder="Additional resources, links, or materials for this lesson..."
      {...register(`lessons.${index}.resources` as const)}
    />
  </div>
);
