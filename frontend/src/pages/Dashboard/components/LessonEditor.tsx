import React from "react";
import type { Lesson } from "./courseTypes";

interface LessonEditorProps {
  lesson: Lesson;
  index: number;
  errors: Record<string, string>;
  onChange: (
    index: number,
    field: keyof Lesson,
    value: string | number | undefined
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  index,
  errors,
  onChange,
  onRemove,
  canRemove,
}) => {
  return (
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lesson Title *
          </label>
          <input
            type="text"
            required
            value={lesson.title}
            onChange={(e) => onChange(index, "title", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors[`lesson${index}Title`]
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } dark:bg-gray-600 dark:text-white`}
            placeholder="Enter lesson title"
          />
          {errors[`lesson${index}Title`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`lesson${index}Title`]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={lesson.duration || ""}
            onChange={(e) =>
              onChange(
                index,
                "duration",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors[`lesson${index}Duration`]
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } dark:bg-gray-600 dark:text-white`}
            placeholder="e.g., 45"
          />
          {errors[`lesson${index}Duration`] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[`lesson${index}Duration`]}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lesson Content *
        </label>
        <textarea
          required
          rows={4}
          value={lesson.content}
          onChange={(e) => onChange(index, "content", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            errors[`lesson${index}Content`]
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } dark:bg-gray-600 dark:text-white`}
          placeholder="Enter lesson content, instructions, or description..."
        />
        {errors[`lesson${index}Content`] && (
          <p className="text-red-500 text-sm mt-1">
            {errors[`lesson${index}Content`]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resources (optional)
        </label>
        <textarea
          rows={2}
          value={lesson.resources || ""}
          onChange={(e) => onChange(index, "resources", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-600 dark:text-white"
          placeholder="Additional resources, links, or materials for this lesson..."
        />
      </div>
    </div>
  );
};

export default LessonEditor;
