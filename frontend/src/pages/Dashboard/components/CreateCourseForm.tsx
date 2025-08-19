import { useState } from "react";

interface Lesson {
  title: string;
  content: string;
  order: number;
  duration?: number;
  resources?: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string;
  lessons: Lesson[];
}

const CreateCourseForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    language: "",
    level: "beginner",
    price: 0,
    thumbnail: "",
    lessons: [
      {
        title: "",
        content: "",
        order: 1,
        duration: undefined,
        resources: "",
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";

    if (formData.lessons.length === 0) {
      newErrors.lessons = "At least one lesson is required";
    }

    formData.lessons.forEach((lesson, index) => {
      if (!lesson.title.trim()) {
        newErrors[`lesson${index}Title`] = `Lesson ${
          index + 1
        } title is required`;
      }
      if (!lesson.content.trim()) {
        newErrors[`lesson${index}Content`] = `Lesson ${
          index + 1
        } content is required`;
      }
      if (lesson.duration && lesson.duration <= 0) {
        newErrors[`lesson${index}Duration`] = `Lesson ${
          index + 1
        } duration must be positive`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validLessons = formData.lessons
        .filter((lesson) => lesson.title.trim() && lesson.content.trim())
        .map((lesson, index) => ({
          title: lesson.title.trim(),
          content: lesson.content.trim(),
          order: index + 1,
          duration: lesson.duration || null,
          resources: lesson.resources?.trim() || null,
        }));

      if (validLessons.length === 0) {
        setErrors({
          submit: "At least one lesson with title and content is required",
        });
        setIsSubmitting(false);
        return;
      }

      alert(`Course created successfully with ${validLessons.length} lessons!`);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Failed to create course:", error);
      setErrors({ submit: "Failed to create course. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: "",
          content: "",
          order: prev.lessons.length + 1,
          duration: undefined,
          resources: "",
        },
      ],
    }));
  };

  const removeLesson = (index: number) => {
    if (formData.lessons.length > 1) {
      setFormData((prev) => ({
        ...prev,
        lessons: prev.lessons
          .filter((_, i) => i !== index)
          .map((lesson, i) => ({
            ...lesson,
            order: i + 1,
          })),
      }));
    }
  };

  const updateLesson = (
    index: number,
    field: keyof Lesson,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson, i) =>
        i === index ? { ...lesson, [field]: value } : lesson
      ),
    }));
  };

  const categories = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Design",
    "Business",
    "Marketing",
    "Finance",
    "Health & Fitness",
    "Music",
    "Art",
    "Language",
    "Other",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Course
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build your course with lessons and content
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Course Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Course Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                  placeholder="Enter course title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language *
                </label>
                <select
                  required
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.language
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select language</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">{errors.language}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level *
                </label>
                <select
                  required
                  value={formData.level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      level: e.target.value as
                        | "beginner"
                        | "intermediate"
                        | "advanced",
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.price
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } dark:bg-gray-700 dark:text-white`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } dark:bg-gray-700 dark:text-white`}
                placeholder="Describe your course content, objectives, and what students will learn..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Lessons Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Lessons ({formData.lessons.length})
              </h3>
              <button
                type="button"
                onClick={addLesson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add Lesson</span>
              </button>
            </div>

            {errors.lessons && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {errors.lessons}
                </p>
              </div>
            )}

            {formData.lessons.map((lesson, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Lesson {index + 1}
                  </h4>
                  {formData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
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
                      onChange={(e) =>
                        updateLesson(index, "title", e.target.value)
                      }
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
                        updateLesson(
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
                    onChange={(e) =>
                      updateLesson(index, "content", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateLesson(index, "resources", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:bg-gray-600 dark:text-white"
                    placeholder="Additional resources, links, or materials for this lesson..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  <span>Creating Course...</span>
                </div>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
