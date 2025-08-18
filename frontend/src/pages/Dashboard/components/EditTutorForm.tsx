import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  updateTutor,
  setShowEditTutorForm,
} from "../../../store/slice/adminSlice";
import api from "../../../services/api";

interface EditTutorFormProps {
  tutorId: string;
}

const EditTutorForm = ({ tutorId }: EditTutorFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updatingTutor } = useSelector((state: RootState) => state.admin);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    bio: "",
    expertise: [] as string[],
    isVerified: false,
  });

  const [expertiseInput, setExpertiseInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/tutors/${tutorId}`);
        const tutor = response.data.data;

        setFormData({
          firstName: tutor.user.firstName || "",
          lastName: tutor.user.lastName || "",
          phone: tutor.user.phone || "",
          avatar: tutor.user.avatar || "",
          bio: tutor.bio || "",
          expertise: tutor.expertise || [],

          isVerified: tutor.isVerified || false,
        });
      } catch (error) {
        console.error("Failed to fetch tutor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

  const handleAddExpertise = () => {
    if (
      expertiseInput.trim() &&
      !formData.expertise.includes(expertiseInput.trim())
    ) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      formData.expertise.length === 0
    ) {
      return;
    }

    try {
      await dispatch(updateTutor({ tutorId, tutorData: formData })).unwrap();
    } catch (error) {
      console.error("Failed to update tutor:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setShowEditTutorForm(null));
  };

  if (loading) {
    return (
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="text-center py-4">Loading tutor data...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  avatar: e.target.value,
                })
              }
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Status
            </label>
            <select
              value={formData.isVerified.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isVerified: e.target.value === "true",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="false">Not Verified</option>
              <option value="true">Verified</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) =>
              setFormData({
                ...formData,
                bio: e.target.value,
              })
            }
            placeholder="Tell us about your teaching experience and background..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expertise Areas *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              placeholder="e.g., JavaScript, React, Python"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddExpertise}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Add
            </button>
          </div>
          {formData.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveExpertise(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
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
            disabled={updatingTutor}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {updatingTutor ? "Updating..." : "Update Tutor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTutorForm;
