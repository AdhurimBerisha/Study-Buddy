import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { courses, toCourseSlug } from "../Courses/data";
import { FaCheckCircle } from "react-icons/fa";
import { getCurriculumBySlug } from "../Courses/curriculum";

const MyLearning = () => {
  const {
    enrolledCourseSlugs,
    purchasedCourseSlugs,
    progressByCourseSlug,
    completedCourseSlugs,
  } = useSelector((s: RootState) => s.learning);
  const enrolledCourses = courses.filter((c) =>
    enrolledCourseSlugs.includes(toCourseSlug(c.language))
  );
  const purchasedNotEnrolled = courses.filter((c) => {
    const slug = toCourseSlug(c.language);
    return (
      purchasedCourseSlugs.includes(slug) && !enrolledCourseSlugs.includes(slug)
    );
  });

  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">My Learning</h1>
        <p className="text-gray-600 mb-6">You have no enrolled courses yet.</p>
        <Link to="/courses">
          <Button>Browse courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>
      {purchasedNotEnrolled.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            Purchased (not started)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedNotEnrolled.map((course) => {
              const slug = toCourseSlug(course.language);
              return (
                <div
                  key={slug}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col"
                >
                  <div className="text-xs uppercase font-semibold text-blue-700 bg-blue-100 inline-block px-3 py-1 rounded-full mb-2">
                    {course.category}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {course.language}
                  </h3>
                  <Link to={`/learning/course/${slug}`} className="mt-auto">
                    <Button fullWidth>Start</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => {
          const slug = toCourseSlug(course.language);
          const progress = progressByCourseSlug[slug];
          const completed = progress?.completedLessonIds.length || 0;
          const curriculum = getCurriculumBySlug(slug);
          const total = curriculum.length || 1;
          const isPurchased = purchasedCourseSlugs.includes(slug);
          const percent = Math.round((completed / total) * 100);
          const isCompleted = completedCourseSlugs.includes(slug);

          return (
            <div
              key={slug}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col relative"
            >
              {isCompleted && (
                <div className="absolute top-3 right-3 flex items-center text-green-600">
                  <FaCheckCircle className="text-lg" />
                </div>
              )}
              <div className="text-xs uppercase font-semibold text-blue-700 bg-blue-100 inline-block px-3 py-1 rounded-full mb-2">
                {course.category}
              </div>
              <h2 className="font-bold text-gray-900 mb-2">
                {course.language}
              </h2>
              {isPurchased && (
                <>
                  {isCompleted ? (
                    <div className="text-sm text-green-600 font-medium mb-2 flex items-center">
                      <FaCheckCircle className="mr-1" />
                      Course completed!
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mb-2">
                      Lessons completed: {completed} / {total}
                    </div>
                  )}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                    <div
                      className={`h-2 rounded-full ${
                        isCompleted ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </>
              )}
              <Link to={`/learning/course/${slug}`} className="mt-auto">
                <Button
                  fullWidth
                  variant={isCompleted ? "secondary" : "primary"}
                >
                  {isCompleted ? "Review" : "Continue"}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyLearning;
