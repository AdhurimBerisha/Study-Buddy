import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import Button from "../../components/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-24">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              404
            </h1>
            <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The page
              might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full justify-center">
                <FaHome className="mr-2" />
                Back to Home
              </Button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center px-10 py-3 rounded-3xl border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or try one of these pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/courses"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                Courses
              </Link>
              <Link
                to="/tutors"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                Tutors
              </Link>
              <Link
                to="/groups"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                Groups
              </Link>
              <Link
                to="/about"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-white text-sm">
          <p>
            Need help?{" "}
            <Link
              to="/contact"
              className="underline hover:text-blue-200 transition-colors duration-200"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
