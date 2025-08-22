import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../store/store";
import {
  login,
  clearError,
  resendVerificationEmail,
} from "../../store/slice/authSlice";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";
import FormInput from "../../components/FormInput";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  useCustomPageTitle("Sign In");

  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(clearError());
      const result = await dispatch(login(data));

      if (login.fulfilled.match(result)) {
        toast.success("Login successful! Welcome back!");
        navigate("/");
      } else if (login.rejected.match(result)) {
        const errorPayload = result.payload as
          | {
              message?: string;
              requiresEmailVerification?: boolean;
              email?: string;
            }
          | undefined;

        if (errorPayload?.requiresEmailVerification) {
          setShowVerificationMessage(true);
          setVerificationEmail(errorPayload.email || data.email);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (showVerificationMessage) {
    return (
      <AuthLayout
        title="Email Verification Required"
        subtitle="Please verify your email address before signing in"
        linkText="Don't have an account?"
        linkTo="/register"
        linkLabel="Sign up"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Check your email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We've sent a verification link to{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {verificationEmail}
              </span>
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Please check your email and click the verification link to
              activate your account before signing in.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowVerificationMessage(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200"
            >
              Back to Login
            </button>
            <button
              onClick={() => {
                dispatch(resendVerificationEmail(verificationEmail));
                toast.info("Verification email resent!");
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200"
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
      title="Welcome Back"
      subtitle="Sign in to your StudyBuddy account"
      linkText="Don't have an account?"
      linkTo="/register"
      linkLabel="Sign up"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          })}
          error={errors.email?.message}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<FaLock />}
          required
          register={register("password", {
            required: "Password is required",
          })}
          error={errors.password?.message}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Forgot Password?
          </Link>
        </div>

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
          {isSubmitting || loading ? "Signing In..." : "Sign In"}
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

export default Login;
