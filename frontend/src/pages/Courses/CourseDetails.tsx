import { Link, useParams } from "react-router-dom";
import { FaUsers, FaArrowLeft, FaStar, FaBook } from "react-icons/fa";
import Button from "../../components/Button";
import { findCourseBySlug } from "./data";

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? findCourseBySlug(slug) : undefined;

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <p className="text-gray-600 mb-6">Course not found.</p>
          <Link to="/courses">
            <Button>
              <FaArrowLeft className="mr-2" /> Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
            <div>
              <div className="text-xs sm:text-sm uppercase tracking-wider text-blue-700 font-bold bg-blue-100 inline-block px-3 py-1 rounded-full mb-3">
                {course.category}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                {course.language}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                <FaUsers className="text-blue-600" />
                <span>
                  <span className="font-semibold text-blue-600">
                    {course.tutors}
                  </span>{" "}
                  Active Tutors
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-2">
                  <FaStar className="text-yellow-500" /> High Rated Path
                </span>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Link to="/courses">
                <Button variant="outline" fullWidth>
                  <FaArrowLeft className="mr-2" /> Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBook className="text-blue-600" /> What you’ll learn
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
                <li>Foundations and core concepts for {course.language}</li>
                <li>Hands-on projects and real-world scenarios</li>
                <li>Best practices, patterns and performance</li>
                <li>Interview-ready exercises and guidance</li>
              </ul>
            </div>

            <aside className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Next steps
              </h3>
              <div className="space-y-3">
                <Link to="/tutors">
                  <Button className="mb-3" fullWidth>
                    Find a tutor
                  </Button>
                </Link>
                <Link to="/groups">
                  <Button fullWidth variant="secondary">
                    Join a study group
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
