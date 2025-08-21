import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "debug"
  >("verifying");
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        let token = searchParams.get("token");

        if (!token) {
          const urlParams = new URLSearchParams(location.search);
          token = urlParams.get("token");
        }

        if (!token) {
          const pathParts = location.pathname.split("/");
          const tokenIndex = pathParts.findIndex(
            (part) => part === "verify-email"
          );
          if (tokenIndex !== -1 && pathParts[tokenIndex + 1]) {
            token = pathParts[tokenIndex + 1];
          }
        }

        const debugData = {
          searchParams: Object.fromEntries(searchParams.entries()),
          location: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
          extractedToken: token,
        };

        setDebugInfo(JSON.stringify(debugData, null, 2));

        if (!token) {
          setStatus("debug");
          setMessage(
            "No verification token found in the URL. This commonly happens when clicking links in email clients."
          );
          return;
        }

        const response = await api.get(`/auth/verify-email/${token}`);

        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message);

          const redirectDelay = response.data.alreadyVerified ? 1000 : 3000;
          setTimeout(() => {
            navigate("/login");
          }, redirectDelay);
        } else {
          setStatus("error");
          setMessage(response.data.message || "Verification failed");
        }
      } catch (error: unknown) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Verification failed - please try again or contact support");
      }
    };

    verifyEmail();
  }, [searchParams, location, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verifying Your Email
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === "debug") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Email Client Issue Detected
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              How to fix this:
            </h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Copy the verification link from your email</li>
              <li>Paste it directly into your browser's address bar</li>
              <li>Press Enter to navigate to the verification page</li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
