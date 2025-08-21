import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import type { RootState, AppDispatch } from "../../store/store";
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
import {
  fetchProfile,
  updateProfile,
  clearError,
} from "../../store/slice/authSlice";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const MyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useCustomPageTitle("My Profile");

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Function to handle Google avatar URLs more effectively
  const getOptimizedAvatarUrl = (
    url: string | null | undefined
  ): string | null => {
    if (!url) return null;

    // If it's a Google avatar URL, try to optimize it
    if (url.includes("googleusercontent.com")) {
      // Try different size parameters that might work better
      const baseUrl = url.split("=")[0];
      // Try a larger size first, then fallback to original
      return `${baseUrl}=s200-c`;
    }

    return url;
  };

  // Function to create initials for fallback avatar
  const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName.charAt(0).toUpperCase();
    const last = lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  };

  // Function to handle avatar loading with multiple fallback strategies
  const handleAvatarLoad = (url: string) => {
    // Try to preload the image to check if it's accessible
    const img = new Image();
    img.crossOrigin = "anonymous"; // Try to handle CORS

    img.onload = () => {
      console.log("Avatar image loaded successfully:", url);
      setAvatarLoadError(false);
      setIsAvatarLoading(false);
    };

    img.onerror = () => {
      console.log("Avatar image failed to load:", url);
      // If it's a Google URL, try alternative approaches
      if (url.includes("googleusercontent.com")) {
        const baseUrl = url.split("=")[0];
        const alternativeUrls = [
          `${baseUrl}=s96-c`,
          `${baseUrl}=s48-c`,
          `${baseUrl}=s32-c`,
          url, // Try original URL as last resort
        ];

        console.log("Trying alternative Google avatar URLs:", alternativeUrls);

        // Try each alternative URL
        const tryAlternativeUrl = (index: number) => {
          if (index >= alternativeUrls.length) {
            console.log("All alternative URLs failed");
            setAvatarLoadError(true);
            setIsAvatarLoading(false);
            return;
          }

          const altUrl = alternativeUrls[index];
          console.log(`Trying alternative URL ${index + 1}:`, altUrl);

          const altImg = new Image();
          altImg.crossOrigin = "anonymous";
          altImg.onload = () => {
            console.log("Alternative avatar URL worked:", altUrl);
            setAvatarPreview(altUrl);
            setAvatarLoadError(false);
            setIsAvatarLoading(false);
          };
          altImg.onerror = () => {
            console.log(`Alternative URL ${index + 1} failed, trying next...`);
            tryAlternativeUrl(index + 1);
          };
          altImg.src = altUrl;
        };

        tryAlternativeUrl(0);
      } else {
        setAvatarLoadError(true);
        setIsAvatarLoading(false);
      }
    };

    img.src = url;
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    } else {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      });

      if (user.avatar) {
        const optimizedUrl = getOptimizedAvatarUrl(user.avatar);
        if (optimizedUrl) {
          setAvatarPreview(optimizedUrl);
          setIsAvatarLoading(true);
          handleAvatarLoad(optimizedUrl);
        } else {
          setAvatarPreview(null);
          setAvatarLoadError(false);
          setIsAvatarLoading(false);
        }
      } else {
        setAvatarPreview(null);
        setAvatarLoadError(false);
        setIsAvatarLoading(false);
      }

      setSelectedAvatarFile(null);
      setAvatarError(null);
    }
  }, [user, reset, dispatch]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size must be less than 5MB");
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file");
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedAvatarFile(file);
    setAvatarError(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(
        updateProfile({
          profileData: data,
          avatarFile: selectedAvatarFile || undefined,
        })
      ).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedAvatarFile(null);
      dispatch(clearError());
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-red-500 dark:text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "Failed to load profile"}
          </p>
          <Button
            onClick={() => {
              dispatch(fetchProfile());
              toast.info("Retrying to load profile...");
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserCircle className="text-red-500 dark:text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Not Authenticated
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center relative">
            <div className="relative inline-block">
              {avatarPreview && !avatarLoadError ? (
                <div className="relative">
                  {isAvatarLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <img
                    src={avatarPreview}
                    alt={`${user.firstName} avatar`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onLoadStart={() => setIsAvatarLoading(true)}
                    onError={() => {
                      console.log(
                        "Avatar image failed to load:",
                        avatarPreview
                      );
                      setAvatarLoadError(true);
                      setIsAvatarLoading(false);
                    }}
                    onLoad={() => {
                      console.log(
                        "Avatar image loaded successfully:",
                        avatarPreview
                      );
                      setAvatarLoadError(false);
                      setIsAvatarLoading(false);
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                  {user.avatar ? (
                    // Show initials when avatar fails to load
                    <div className="text-white font-bold text-2xl sm:text-3xl">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  ) : (
                    <FaUserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                  )}
                </div>
              )}

              {/* Debug info - remove this after fixing */}
              {avatarPreview && (
                <div className="mt-2 text-xs text-blue-100">
                  {avatarLoadError && (
                    <span className="text-red-200 ml-2">(Failed to load)</span>
                  )}
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-200 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-300 transition-colors duration-200 group"
              >
                <FaCamera className="w-4 h-4 text-gray-600 dark:text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {avatarError && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-md text-sm">
                {avatarError}
              </div>
            )}

            <div className="mt-4 text-white">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
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
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
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
