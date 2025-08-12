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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedCourses.map((course) => (
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

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
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
                Purchased: {new Date(course.purchaseDate).toLocaleDateString()}
              </div>

              <Link to={`/learning/course/${course.id}`}>
                <Button fullWidth className="flex items-center justify-center">
                  Continue Learning
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
