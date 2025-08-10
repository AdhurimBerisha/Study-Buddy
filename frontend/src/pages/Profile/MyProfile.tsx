import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { RootState } from "../../store/store";
import FormInput from "../../components/FormInput";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
  FaCamera,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useMyProfileQuery } from "../../store/api/authApi";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const MyProfile = () => {
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useMyProfileQuery(undefined, {
    skip: !currentUser,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || "",
      });
      setAvatarPreview(currentUser.avatar || null);
    }
    if (
      profileData &&
      (!currentUser?.phone || currentUser.phone !== profileData.phone)
    ) {
      reset({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone ?? "",
      });
    }
  }, [currentUser, profileData, reset]);

  if (loading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  if (error || profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">
            {(error as string) || "Failed to load profile"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Not Authenticated
          </h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile updated:", data);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center relative">
            <div className="relative inline-block">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${currentUser.firstName} avatar`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                  <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                </div>
              )}

              {/* Camera Icon Overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 group"
              >
                <FaCamera className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="mt-4 text-white">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <FaEdit className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormInput
                  label="First Name"
                  placeholder="Enter your first name"
                  icon={<FaUser />}
                  required
                  disabled={!isEditing}
                  register={register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                    maxLength: {
                      value: 50,
                      message: "Less than 50 characters",
                    },
                  })}
                  error={errors.firstName?.message}
                />

                <FormInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  icon={<FaUser />}
                  required
                  disabled={!isEditing}
                  register={register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                    maxLength: {
                      value: 50,
                      message: "Less than 50 characters",
                    },
                  })}
                  error={errors.lastName?.message}
                />
              </div>

              <FormInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<FaEnvelope />}
                required
                disabled={!isEditing}
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email?.message}
              />

              <FormInput
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number (optional)"
                icon={<FaPhone />}
                disabled={!isEditing}
                register={register("phone", {
                  pattern: {
                    value: /^[+]?[\d]{1,16}$/,
                    message: "Invalid phone number",
                  },
                })}
                error={errors.phone?.message}
              />

              {isEditing && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FaSave className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
