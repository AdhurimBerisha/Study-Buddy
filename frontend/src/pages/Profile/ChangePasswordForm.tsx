import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { userAPI } from "../../services/api";
import { toast } from "react-toastify";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ChangePasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully!");
      reset();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ApiError).response?.data?.message ||
            "Failed to change password"
          : "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          icon={<FaLock />}
          required
          register={register("currentPassword", {
            required: "Current password is required",
          })}
          error={errors.currentPassword?.message}
        />

        <FormInput
          label="New Password"
          type="password"
          placeholder="Enter new password"
          icon={<FaLock />}
          required
          register={register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.newPassword?.message}
        />
      </div>

      <FormInput
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        icon={<FaLock />}
        required
        register={register("confirmPassword", {
          required: "Please confirm your new password",
          validate: (val: string) => {
            if (newPassword !== val) {
              return "Passwords do not match";
            }
          },
        })}
        error={errors.confirmPassword?.message}
      />

      <div className="pt-2">
        <Button
          type="submit"
          size="md"
          fullWidth
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FaLock className="w-4 h-4 mr-2" />
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
