import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../store/store";
import {
  register as registerUser,
  resendVerificationEmail,
} from "../../store/slice/authSlice";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";
import FormInput from "../../components/FormInput";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const Register = () => {
  useCustomPageTitle("Sign Up");

  const [showVerificationReminder, setShowVerificationReminder] =
    useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(result)) {
        toast.success(
          "Registration successful! Please check your email to verify your account."
        );
        setVerificationEmail(data.email);
        setShowVerificationReminder(true);
        reset();
      } else if (registerUser.rejected.match(result)) {
        const errorPayload = result.payload as
          | {
              message?: string;
              requiresEmailVerification?: boolean;
              email?: string;
            }
          | undefined;

        if (errorPayload?.requiresEmailVerification) {
          setShowVerificationReminder(true);
          setVerificationEmail(errorPayload.email || data.email);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  if (showVerificationReminder) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a verification link to your email address"
        linkText="Already verified?"
        linkTo="/login"
        linkLabel="Sign in"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Verify your email address
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We've sent a verification link to{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {verificationEmail}
              </span>
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Please check your email and click the verification link to
              activate your account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowVerificationReminder(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
            >
              Back to Registration
            </button>
            <button
              onClick={() => {
                dispatch(resendVerificationEmail(verificationEmail));
                toast.info("Verification email resent!");
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              Resend Email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join StudyBuddy and start your learning journey"
      linkText="Already have an account?"
      linkTo="/login"
      linkLabel="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="Enter your first name"
            icon={<FaUser />}
            required
            register={register("firstName", {
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "First name must be less than 50 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message:
                  "First name can only contain letters, spaces, hyphens, and apostrophes",
              },
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
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Last name must be less than 50 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message:
                  "Last name can only contain letters, spaces, hyphens, and apostrophes",
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
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please provide a valid email address",
            },
            maxLength: {
              value: 255,
              message: "Email must be less than 255 characters",
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
              value: /^[+]?[\d\s\-()]{10,20}$/,
              message: "Please provide a valid phone number",
            },
            maxLength: {
              value: 20,
              message: "Phone number must be less than 20 characters",
            },
          })}
          error={errors.phone?.message}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Create a strong password"
          icon={<FaLock />}
          required
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message:
                "Password must contain at least one lowercase letter, one uppercase letter, and one number",
            },
          })}
          error={errors.password?.message}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<FaLock />}
          required
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting || loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
