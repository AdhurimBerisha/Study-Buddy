import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaUserCircle,
  FaStar,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Button from "../../components/Button";
import { tutorAPI } from "../../services/api";
import type { Tutor } from "../../types/tutor";

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
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutor details...</p>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <p className="text-gray-600 mb-6">{error || "Tutor not found."}</p>
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
                {tutor.expertise.join(", ")}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {tutor.user.firstName} {tutor.user.lastName}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />{" "}
                  {Number(tutor.rating).toFixed(1)}
                </span>
                <span>•</span>
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
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Expertise
              </h2>
              <p className="text-gray-700">{tutor.expertise.join(", ")}</p>
            </div>

            {tutor.courses && tutor.courses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutor.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.level}
                        </span>
                        <span className="text-sm font-medium">
                          ${course.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChalkboardTeacher className="text-blue-600" /> Start Learning
            </h3>
            <div className="space-y-4 text-sm">
              <p className="text-gray-700 mb-2">
                Start your career from learning with {tutor.user.firstName}{" "}
                {tutor.user.lastName}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Hourly Rate:</strong> ${Number(tutor.hourlyRate).toFixed(2)}/hour
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Students:</strong> {tutor.totalStudents}
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
