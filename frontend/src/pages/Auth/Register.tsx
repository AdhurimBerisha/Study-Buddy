import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { register, clearError } from "../../store/slice/authSlice";
import AuthLayout from "./AuthLayout";
import Button from "../../components/Button";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { toast } from "react-toastify";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const Register = () => {
  useCustomPageTitle("Sign Up");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [showVerificationReminder, setShowVerificationReminder] =
    useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    });
  };

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const result = await dispatch(
      register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      })
    );

    if (register.fulfilled.match(result)) {
      const payload = result.payload as {
        requiresEmailVerification?: boolean;
        message?: string;
      };

      if (payload.requiresEmailVerification) {
        toast.success(
          "Account created successfully! Please check your email to verify your account before signing in."
        );
        setShowVerificationReminder(true);
        clearForm();
      } else {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      }
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join StudyBuddy and start learning together"
      linkText="Already have an account?"
      linkTo="/login"
      linkLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

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
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number (optional)"
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
            placeholder="Create a password"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {showVerificationReminder && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
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
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Check Your Email
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                We've sent a verification email to{" "}
                <strong>{formData.email}</strong>. Please check your inbox and
                click the verification link to activate your account.
              </p>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                💡 <strong>Tip:</strong> If clicking the link in your email
                doesn't work, try copying and pasting it directly into your
                browser's address bar.
              </div>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowVerificationReminder(false)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
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
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
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
