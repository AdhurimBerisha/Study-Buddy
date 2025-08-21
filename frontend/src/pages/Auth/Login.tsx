import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { login, clearError, clearRedirect } from "../../store/slice/authSlice";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const Login = () => {
  useCustomPageTitle("Sign In");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, redirectTo } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setShowVerificationMessage(false);

    const result = await dispatch(login(formData));

    if (login.fulfilled.match(result)) {
      toast.success("Login successful! Welcome back!");
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
        setVerificationEmail(errorPayload.email || formData.email);
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your StudyBuddy account"
      linkText="Don't have an account?"
      linkTo="/register"
      linkLabel="Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {showVerificationMessage && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5"
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
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Email Verification Required
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Please verify your email address before signing in. We sent a
                verification email to <strong>{verificationEmail}</strong>.
              </p>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium"
                >
                  Create New Account
                </button>
                <button
                  onClick={() => setShowVerificationMessage(false)}
                  className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
