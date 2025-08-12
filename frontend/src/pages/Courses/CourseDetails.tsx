import { Link, useParams } from "react-router-dom";
import {
  FaUsers,
  FaArrowLeft,
  FaStar,
  FaBook,
  FaUserCircle,
  FaLock,
  FaDollarSign,
  FaGraduationCap,
} from "react-icons/fa";
import Button from "../../components/Button";
import { Link as RouterLink } from "react-router-dom";
import { tutors as allTutors, toTutorSlug } from "../Tutors/data";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { useEffect } from "react";
import {
  fetchCourse,
  enrollInCourse,
  clearCurrentCourse,
} from "../../store/slice/coursesSlice";

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

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourse(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  const handleEnroll = async () => {
    if (courseId && isAuthenticated) {
      try {
        await dispatch(enrollInCourse(courseId)).unwrap();
        dispatch(fetchCourse(courseId));
      } catch (error) {
        console.error("Failed to enroll:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
          <p className="text-red-600 mb-6">{error || "Course not found."}</p>
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
                {course.title}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">{course.language}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  <span>
                    <span className="font-semibold text-blue-600">
                      {course.enrollmentCount || 0}
                    </span>{" "}
                    Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-green-600" />
                  <span className="capitalize font-semibold">
                    {course.level} Level
                  </span>
                </div>
                {course.totalLessons && (
                  <div className="flex items-center gap-2">
                    <FaBook className="text-purple-600" />
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                )}
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-600" />
                    <span>
                      by {course.instructor.firstName}{" "}
                      {course.instructor.lastName}
                    </span>
                  </div>
                )}
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
                <FaBook className="text-blue-600" /> Course Description
              </h2>
              <div className="text-gray-700 leading-relaxed mb-6">
                <p>{course.description}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What you'll learn
              </h3>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <FaDollarSign className="text-green-600" />
                    Course price
                  </span>
                  <span className="text-blue-600 font-extrabold text-lg">
                    ${Number(course.price).toFixed(2)}
                  </span>
                </div>

                {course.enrollment && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">
                        Progress
                      </span>
                      <span className="text-green-600 font-bold">
                        {course.enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${course.enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {course.isEnrolled ? (
                    <div className="mb-4">
                      <RouterLink to={`/learning/course/${courseId}`}>
                        <Button fullWidth>Continue Learning</Button>
                      </RouterLink>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        {isAuthenticated ? (
                          <Button fullWidth onClick={handleEnroll}>
                            Enroll Now
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            className="opacity-75 cursor-not-allowed"
                            onClick={() =>
                              alert("Please log in to enroll in this course.")
                            }
                          >
                            <FaLock className="mr-2" /> Login to Enroll
                          </Button>
                        )}
                      </div>

                      <div className="mb-4">
                        {isAuthenticated ? (
                          <RouterLink
                            to="/checkout"
                            state={{
                              type: "course",
                              course: {
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
                      </div>
                    </>
                  )}
                </div>
                <Link to="/groups" className="mt-4 block">
                  <Button fullWidth variant="secondary">
                    Join a study group
                  </Button>
                </Link>
              </div>
            </aside>
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Featured tutors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {allTutors.slice(0, 2).map((tutor) => (
                <div
                  key={tutor.id}
                  className="rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 text-3xl">
                    <FaUserCircle />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">
                          {tutor.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tutor.headline}
                        </p>
                      </div>
                      <div className="text-sm text-gray-700 flex items-center gap-1">
                        <FaStar className="text-yellow-500" />{" "}
                        {tutor.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="mr-3">{tutor.lessons} lessons</span>
                      <span className="mr-3">Hourly: {tutor.hourlyRate}</span>
                      <span>Trial: {tutor.trialRate}</span>
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
                            trialRate: parseFloat(
                              tutor.trialRate.replace(/[^0-9.]/g, "")
                            ),
                            hourlyRate: parseFloat(
                              tutor.hourlyRate.replace(/[^0-9.]/g, "")
                            ),
                          },
                          booking: { isTrial: true },
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
    </div>
  );
};

export default CourseDetails;
