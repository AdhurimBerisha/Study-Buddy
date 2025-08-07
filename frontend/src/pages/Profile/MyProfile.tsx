import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import type { RootState, AppDispatch } from "../../store/store";
import FormInput from "../../components/FormInput";
import { FaUser, FaEnvelope, FaPhone, FaUserCircle } from "react-icons/fa";
import Button from "../../components/Button";
import { useState, useEffect } from "react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

const MyProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useSelector((state: RootState) =>
    state.auth.users.find((u) => u.id === userId)
  );

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, reset]);

  if (!user) return <div>User not found</div>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  const onSubmit = (data: ProfileFormData) => {
    // TODO: Dispatch Redux action to update user profile + avatar
  };

  return (
    <div className="max-w-md mx-auto p-16 space-y-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={`${user.firstName} avatar`}
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}

          <label
            htmlFor="avatar-upload"
            className="mt-3 cursor-pointer text-blue-600 hover:underline text-sm"
          >
            Change Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="Enter your first name"
            icon={<FaUser />}
            required
            register={register("firstName", {
              required: "First name is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 50, message: "Less than 50 characters" },
            })}
            error={errors.firstName?.message}
          />

          <FormInput
            label="Last Name"
            placeholder="Enter your last name"
            icon={<FaUser />}
            required
            register={register("lastName", {
              required: "Last name is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 50, message: "Less than 50 characters" },
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
          register={register("phone", {
            pattern: {
              value: /^[+]?[\d]{1,16}$/,
              message: "Invalid phone number",
            },
          })}
          error={errors.phone?.message}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default MyProfile;
