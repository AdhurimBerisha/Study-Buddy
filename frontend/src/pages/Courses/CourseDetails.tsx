import { Link, useParams } from "react-router-dom";
import {
  FaUsers,
  FaArrowLeft,
  FaStar,
  FaBook,
  FaUserCircle,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import Button from "../../components/Button";
import { Link as RouterLink } from "react-router-dom";
import { tutors as allTutors, toTutorSlug } from "../Tutors/data";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import {
  fetchCourse,
  clearCurrentCourse,
} from "../../store/slice/coursesSlice";
import { purchaseAPI } from "../../services/api";
import { useCustomPageTitle } from "../../hooks/usePageTitle";

const CourseDetails = () => {
  const { slug: courseId } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentCourse: course,
    loading,
    error,
  } = useSelector((s: RootState) => s.courses);
  const { token } = useSelector((s: RootState) => s.auth);
  const isAuthenticated = !!token;
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  useCustomPageTitle(course?.title || undefined);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourse(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (isAuthenticated && courseId) {
        setCheckingPurchase(true);

        try {
          const dashboardResponse = await purchaseAPI.getLearningDashboard();
          const purchasedCourses = dashboardResponse.data.data || [];

          const hasPurchased = purchasedCourses.some(
            (c: { id: string }) => c.id === courseId
          );

          if (hasPurchased) {
            setIsPurchased(true);
            return;
          }

          try {
            const response = await purchaseAPI.checkCoursePurchase(courseId);
            const purchased = response.data.purchased || false;
            setIsPurchased(purchased);
          } catch (directError) {
            console.error("Direct API failed:", directError);
          }
        } catch (fallbackError) {
          console.error("Fallback method failed:", fallbackError);
          setIsPurchased(false);
        } finally {
          setCheckingPurchase(false);
        }
      } else {
        console.log("🔍 Not checking purchase status:", {
          isAuthenticated,
          courseId,
        });
      }
    };

    checkPurchaseStatus();
  }, [isAuthenticated, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading course: {error}
          </p>
          <Button onClick={() => dispatch(fetchCourse(courseId!))}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">
                {course.language}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-2">
                  <FaUsers className="text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">
                    {course.enrollmentCount || 0} Students
                  </span>
                </span>
                <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                  {course.level} Level
                </span>
                {course.totalLessons && (
                  <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full flex items-center gap-2">
                    <FaBook className="text-purple-600 dark:text-purple-400" />
                    {course.totalLessons} Lessons
                  </span>
                )}
                {course.instructor && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                    <FaUserCircle className="text-gray-600 dark:text-gray-400" />
                    by {course.instructor.firstName}{" "}
                    {course.instructor.lastName}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <Link to="/courses">
                <Button variant="outline" fullWidth>
                  <FaArrowLeft className="mr-2" /> Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FaBook className="text-blue-600 dark:text-blue-400" /> Course
              Description
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              <p className="line-clamp-2">{course.description}</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              What you'll learn
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>Foundations and core concepts for {course.language}</li>
              <li>Hands-on projects and real-world scenarios</li>
              <li>Best practices, patterns and performance</li>
              <li>Interview-ready exercises and guidance</li>
            </ul>
          </div>

          <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Next steps
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 mb-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Course price
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold text-lg">
                  ${Number(course.price).toFixed(2)}
                </span>
              </div>
              {course.isEnrolled ? (
                <RouterLink to={`/learning/course/${courseId}`}>
                  <Button fullWidth>Continue Learning</Button>
                </RouterLink>
              ) : isPurchased ? (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center mb-3">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl mx-auto mb-2" />
                    <p className="text-green-800 dark:text-green-300 font-semibold">
                      Already Purchased
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      You have full access to this course
                    </p>
                  </div>
                  <RouterLink
                    to={`/learning/course/${courseId}`}
                    className="block"
                  >
                    <Button fullWidth variant="outline">
                      Start Learning
                    </Button>
                  </RouterLink>
                </>
              ) : checkingPurchase ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">
                    Checking purchase status...
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Please wait while we verify your access
                  </p>
                </div>
              ) : (
                <>
                  {isAuthenticated ? (
                    <RouterLink
                      to="/checkout"
                      state={{
                        type: "course",
                        course: {
                          id: course.id,
                          title: course.title,
                          price: course.price,
                        },
                      }}
                    >
                      <Button fullWidth variant="secondary">
                        Buy Course - ${Number(course.price).toFixed(2)}
                      </Button>
                    </RouterLink>
                  ) : (
                    <Button
                      fullWidth
                      variant="secondary"
                      className="opacity-75 cursor-not-allowed"
                      onClick={() =>
                        alert("Please log in to purchase this course.")
                      }
                    >
                      <FaLock className="mr-2" /> Login to Buy Course
                    </Button>
                  )}
                </>
              )}
              <Link to="/groups" className="block">
                <Button fullWidth variant="secondary">
                  Join a study group
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured tutors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allTutors.slice(0, 2).map((tutor) => (
              <div
                key={tutor.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex gap-4 items-start"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-3xl">
                  <FaUserCircle />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                        {tutor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {tutor.headline}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <FaStar className="text-yellow-500" />{" "}
                      {Number(tutor.rating).toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-3">{tutor.lessons} lessons</span>

                    <span>Available for consultation</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link to={`/tutors/${toTutorSlug(tutor.name)}`}>
                      <Button size="sm">View Profile</Button>
                    </Link>
                    <Link
                      to="/checkout"
                      state={{
                        type: "tutor",
                        tutor: {
                          name: tutor.name,
                        },
                        booking: { duration: 1 },
                      }}
                    >
                      <Button size="sm" variant="secondary">
                        Book Trial
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
