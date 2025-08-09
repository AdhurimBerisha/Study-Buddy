import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserCircle,
  FaStar,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Button from "../../components/Button";
import { findTutorBySlug } from "./data";

const TutorDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const tutor = slug ? findTutorBySlug(slug) : undefined;

  if (!tutor) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <p className="text-gray-600 mb-6">Tutor not found.</p>
          <Link to="/tutors">
            <Button>
              <FaArrowLeft className="mr-2" /> Back to Tutors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100 flex items-start justify-between gap-6 flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 text-4xl">
              <FaUserCircle />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-700 font-bold bg-blue-100 inline-block px-3 py-1 rounded-full mb-2">
                {tutor.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {tutor.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />{" "}
                  {tutor.rating.toFixed(1)}
                </span>
                <span>•</span>
                <span>{tutor.lessons} lessons</span>
              </div>
            </div>
          </div>
          <Link to="/tutors">
            <Button variant="outline" fullWidth>
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>{tutor.headline}</strong> {tutor.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Speaks
              </h2>
              <p className="text-gray-700">{tutor.speaks}</p>
            </div>
          </div>

          <aside className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChalkboardTeacher className="text-blue-600" /> Start Learning
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-700 mb-2">
                Start your career from learning with {tutor.name}
              </p>
              <Link to="/courses">
                <Button fullWidth>Courses</Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;
