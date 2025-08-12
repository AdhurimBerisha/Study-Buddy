import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { FaBookOpen, FaArrowRight, FaClock } from "react-icons/fa";
import { useLearning } from "../../hooks/useLearning";
import { useAuth } from "../../hooks/useAuth";

interface PurchasedCourse {
  id: string;
  title: string;
  language: string;
  imageUrl: string;
  progress: number;
  lastAccessed: string;
  totalLessons: number;
  completedLessons: number;
  purchaseDate: string;
}

const MyLearning: React.FC = () => {
  const { loadLearningDashboard } = useLearning();
  const { user } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        console.log("Fetching purchased courses...");
        console.log("User:", user);
        console.log("Token:", localStorage.getItem("token"));
        const courses = await loadLearningDashboard();
        console.log("Received courses:", courses);
        setPurchasedCourses(courses);
      } catch (error) {
        console.error("Failed to fetch purchased courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPurchasedCourses();
    } else {
      setLoading(false);
    }
  }, [loadLearningDashboard, user]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your learning progress...</p>
      </div>
    );
  }

  if (purchasedCourses.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">My Learning</h1>
        <p className="text-gray-600 mb-6">
          Purchase courses to start learning! Once you buy a course, you'll have
          full access to all lessons and can track your progress.
        </p>
        <div className="space-y-4">
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
          <p className="text-sm text-gray-500">
            No enrollment needed - just purchase and start learning immediately!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">
          Continue where you left off with your purchased courses
        </p>

        {/* Learning Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {purchasedCourses.length}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {
                purchasedCourses.filter((course) => course.progress === 100)
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {
                purchasedCourses.filter(
                  (course) => course.progress > 0 && course.progress < 100
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Completion Status Filter */}
      <div className="mb-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !category
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Courses ({purchasedCourses.length})
          </button>
          <button
            onClick={() => setCategory("in-progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === "in-progress"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            In Progress (
            {
              purchasedCourses.filter(
                (course) => course.progress > 0 && course.progress < 100
              ).length
            }
            )
          </button>
          <button
            onClick={() => setCategory("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              category === "completed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed (
            {
              purchasedCourses.filter((course) => course.progress === 100)
                .length
            }
            )
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedCourses
          .filter((course) => {
            if (category === "completed" && course.progress !== 100) {
              return false;
            }
            if (
              category === "in-progress" &&
              (course.progress === 0 || course.progress === 100)
            ) {
              return false;
            }
            return true;
          })
          .map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Purchased
                </div>
                {course.progress === 100 && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <FaBookOpen className="mr-1" />
                    Completed
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {course.language}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Course Completion Message */}
                {course.progress === 100 && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center text-green-700">
                      <FaBookOpen className="mr-2 text-green-600" />
                      <span className="font-semibold text-sm">
                        Course Completed! 🎉
                      </span>
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                      Congratulations! You've successfully completed this
                      course.
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        course.progress === 100 ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span>{course.lastAccessed}</span>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Purchased:{" "}
                  {new Date(course.purchaseDate).toLocaleDateString()}
                </div>

                <Link to={`/learning/course/${course.id}`}>
                  <Button
                    fullWidth
                    className={`flex items-center justify-center ${
                      course.progress === 100
                        ? "bg-green-600 hover:bg-green-700 border-green-600"
                        : ""
                    }`}
                  >
                    {course.progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                    <FaArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/courses">
          <Button variant="secondary">
            <FaBookOpen className="mr-2" />
            Browse More Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyLearning;
