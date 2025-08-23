import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";
import Button from "../../components/Button";
import { tutorAPI } from "../../services/api";
import type { Tutor } from "../../types/tutor";
import LazyImage from "../../components/LazyImage";

const TutorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await tutorAPI.getTutor(id);
        setTutor(response.data.tutor);
      } catch (err) {
        setError("Failed to fetch tutor details");
        console.error("Error fetching tutor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading tutor details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-10 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Tutor not found."}
          </p>
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
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-700 flex items-start justify-between gap-6 flex-col sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-4xl overflow-hidden">
              {tutor.avatar ? (
                <LazyImage
                  src={tutor.avatar}
                  alt={`${tutor.first_name} ${tutor.last_name}`}
                  className="w-16 h-16 object-cover"
                />
              ) : (
                <FaUserCircle />
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/20 inline-block px-3 py-1 rounded-full mb-2">
                {tutor.expertise.join(", ")}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {tutor.first_name} {tutor.last_name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>{tutor.totalLessons} lessons</span>
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
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tutor.bio}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Expertise
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {tutor.expertise.join(", ")}
              </p>
            </div>

            {tutor.courses && tutor.courses.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutor.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {course.level}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          ${course.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-600 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400" />{" "}
              Start Learning
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Start your career from learning with {tutor.first_name}{" "}
                {tutor.last_name}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">
                  <strong>Total Students:</strong>{" "}
                  <span className="text-gray-700 dark:text-gray-300">
                    {tutor.totalStudents}
                  </span>
                </p>
              </div>
              <Link to="/courses">
                <Button fullWidth>View Courses</Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;
