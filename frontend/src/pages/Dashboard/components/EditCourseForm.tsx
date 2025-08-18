import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { updateCourse, setShowEditCourseForm } from "../../../store/slice/adminSlice";
import api from "../../../services/api";

interface Tutor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface EditCourseFormProps {
  courseId: string;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ courseId, loadingTutors, tutors }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updatingCourse } = useSelector((state: RootState) => state.admin);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    language: "",
    level: "",
    price: 0,
    thumbnail: "",
    totalLessons: 0,
    tutorId: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/courses/${courseId}`);
        const course = response.data.data;
        
        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          language: course.language || "",
          level: course.level || "",
          price: course.price || 0,
          thumbnail: course.thumbnail || "",
          totalLessons: course.totalLessons || 0,
          tutorId: course.tutorId || "",
        });
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title || !formData.description || !formData.category || !formData.language || !formData.level || !formData.tutorId) {
      return;
    }

    try {
      await dispatch(updateCourse({ courseId, courseData: formData })).unwrap();
      // Form will be hidden by Redux actions
    } catch (error) {
      // Error handling is done in Redux
      console.error("Failed to update course:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setShowEditCourseForm(null));
  };

  if (loading) {
    return (
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="text-center py-4">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="languages">Languages</option>
              <option value="music">Music</option>
              <option value="cooking">Cooking</option>
              <option value="fitness">Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language *
            </label>
            <select
              required
              value={formData.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="italian">Italian</option>
              <option value="portuguese">Portuguese</option>
              <option value="russian">Russian</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
              <option value="arabic">Arabic</option>
              <option value="hindi">Hindi</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level *
            </label>
            <select
              required
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Lessons
            </label>
            <input
              type="number"
              min="0"
              value={formData.totalLessons}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalLessons: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thumbnail: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tutor *
            </label>
            <select
              required
              value={formData.tutorId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tutorId: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Tutor</option>
              {loadingTutors ? (
                <option disabled>Loading Tutors...</option>
              ) : tutors && tutors.length > 0 ? (
                tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.user.firstName} {tutor.user.lastName} ({tutor.user.email})
                  </option>
                ))
              ) : (
                <option disabled>No Tutors Available</option>
              )}
            </select>
            {!loadingTutors && tutors && tutors.length === 0 && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                No tutors available. Please create tutor accounts first.
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatingCourse}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {updatingCourse ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
