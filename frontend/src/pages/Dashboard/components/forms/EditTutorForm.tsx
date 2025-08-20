import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../../../store/store";
import {
  updateTutor,
  setShowEditTutorForm,
} from "../../../../store/slice/adminSlice";
import api from "../../../../services/api";
import { InputField, TextAreaField } from "./CourseFormParts";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface EditTutorFormProps {
  tutorId: string;
}

interface EditTutorFormValues {
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  expertise: string[];
  isVerified: boolean;
}

const defaultValues: EditTutorFormValues = {
  firstName: "",
  lastName: "",
  avatar: "",
  bio: "",
  expertise: [],
  isVerified: false,
};

const EditTutorForm = ({ tutorId }: EditTutorFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updatingTutor } = useSelector((state: RootState) => state.admin);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<EditTutorFormValues>({ defaultValues, mode: "onSubmit" });

  const [loading, setLoading] = useState(true);
  const [expertiseInput, setExpertiseInput] = useState("");
  const expertise = watch("expertise");

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/tutors/${tutorId}`);
        const tutor = response.data.data;
        const values: EditTutorFormValues = {
          firstName: tutor.first_name || "",
          lastName: tutor.last_name || "",
          avatar: tutor.avatar || "",
          bio: tutor.bio || "",
          expertise: Array.isArray(tutor.expertise) ? tutor.expertise : [],
          isVerified: Boolean(tutor.isVerified),
        };
        reset(values);
      } catch (error) {
        console.error("Failed to fetch tutor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) fetchTutor();
  }, [tutorId, reset]);

  const handleAddExpertise = () => {
    const value = expertiseInput.trim();
    if (!value) return;
    const current = getValues("expertise") || [];
    if (current.includes(value)) return;
    setValue("expertise", [...current, value], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setExpertiseInput("");
  };

  const handleRemoveExpertise = (index: number) => {
    const current = getValues("expertise") || [];
    setValue(
      "expertise",
      current.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const onSubmit = async (data: EditTutorFormValues) => {
    const skills = (data.expertise || []).filter(
      (s) => s && s.trim().length > 0
    );
    if (skills.length === 0) {
      setError("root.submit", {
        type: "manual",
        message: "At least one expertise area is required",
      });
      return;
    }

    const transformedData = {
      first_name: data.firstName,
      last_name: data.lastName,
      avatar: data.avatar,
      bio: data.bio,
      expertise: skills,
      isVerified: data.isVerified,
    };

    try {
      await dispatch(
        updateTutor({ tutorId, tutorData: transformedData })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update tutor:", error);
    }
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name *"
            placeholder="Enter first name"
            error={errors.firstName?.message as string}
            {...register("firstName", { required: "First name is required" })}
          />

          <InputField
            label="Last Name *"
            placeholder="Enter last name"
            error={errors.lastName?.message as string}
            {...register("lastName", { required: "Last name is required" })}
          />

          <InputField
            label="Avatar URL"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            error={errors.avatar?.message as string}
            {...register("avatar")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Status
            </label>
            <select
              {...register("isVerified", {
                setValueAs: (v) => v === true || v === "true",
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="false">Not Verified</option>
              <option value="true">Verified</option>
            </select>
          </div>
        </div>

        <TextAreaField
          label="Bio"
          rows={3}
          placeholder="Tell us about your teaching experience and background..."
          error={errors.bio?.message as string}
          {...register("bio")}
        />

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
          {expertise && expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
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

        {errors.root?.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">
              {errors.root.submit.message}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => dispatch(setShowEditTutorForm(null))}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatingTutor}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {updatingTutor ? (
              <span className="inline-flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2" />{" "}
                Updating...
              </span>
            ) : (
              "Update Tutor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTutorForm;
