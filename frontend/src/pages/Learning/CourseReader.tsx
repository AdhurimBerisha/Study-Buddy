import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import {
  FaTrophy,
  FaLock,
  FaCheckCircle,
  FaPlay,
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import { useLearning } from "../../hooks/useLearning";
import { useAuth } from "../../hooks/useAuth";
import { selectCourseProgress } from "../../store/slice/learningSlice";

const CourseReader = () => {
  const { slug: courseId } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const {
    currentCourse,
    loading,
    error,
    loadCourseWithLessons,
    loadCourseProgress,

    markLessonComplete,
    markLessonIncomplete,
    setCurrentLesson,
    navigateToMyLearning,
  } = useLearning();

  const courseProgress = useSelector(selectCourseProgress(courseId || ""));

  console.log("🔍 CourseReader - courseId:", courseId);
  console.log("🔍 CourseReader - courseProgress:", courseProgress);
  console.log("🔍 CourseReader - currentCourse:", currentCourse);

  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  useEffect(() => {
    if (courseId) {
      loadCourseWithLessons(courseId);
      loadCourseProgress(courseId);
    }
  }, [courseId, loadCourseWithLessons, loadCourseProgress]);

  useEffect(() => {
    if (currentCourse?.lessons.length && !selectedLessonId) {
      setSelectedLessonId(currentCourse.lessons[0].id);
    }
  }, [currentCourse, selectedLessonId]);

  useEffect(() => {
    if (selectedLessonId) {
      const lesson = currentCourse?.lessons.find(
        (l) => l.id === selectedLessonId
      );
      if (lesson) {
        setCurrentLesson(lesson);
      }
    }
  }, [selectedLessonId, currentCourse, setCurrentLesson]);

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
  };

  const handleLessonComplete = async (
    lessonId: string,
    isCompleted: boolean
  ) => {
    try {
      if (isCompleted) {
        await markLessonComplete(courseId!, lessonId);
      } else {
        await markLessonIncomplete(courseId!, lessonId);
      }

      await loadCourseProgress(courseId!);
    } catch (error) {
      console.error("Failed to update lesson progress:", error);
    }
  };

  const goToPreviousLesson = () => {
    if (!currentCourse || !selectedLessonId) return;

    const currentIndex = currentCourse.lessons.findIndex(
      (l) => l.id === selectedLessonId
    );
    if (currentIndex > 0) {
      const prevLesson = currentCourse.lessons[currentIndex - 1];
      handleLessonSelect(prevLesson.id);
    }
  };

  const goToNextLesson = () => {
    if (!currentCourse || !selectedLessonId) return;

    const currentIndex = currentCourse.lessons.findIndex(
      (l) => l.id === selectedLessonId
    );
    if (currentIndex >= 0 && currentIndex < currentCourse.lessons.length - 1) {
      const nextLesson = currentCourse.lessons[currentIndex + 1];
      handleLessonSelect(nextLesson.id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => loadCourseWithLessons(courseId!)}>Retry</Button>
      </div>
    );
  }

  if (!courseId || !currentCourse) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 mb-4">Course not found.</p>
        <Button onClick={navigateToMyLearning}>Back to My Learning</Button>
      </div>
    );
  }

  const selectedLesson = currentCourse?.lessons.find(
    (l) => l.id === selectedLessonId
  );
  const isEnrolled = true;
  const completionPercentage = courseProgress?.completionPercentage || 0;
  const isCompleted = completionPercentage === 100;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Curriculum</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToMyLearning}
            className="flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </Button>
        </div>

        {!isEnrolled && (
          <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
            <FaLock className="inline mr-1" />
            You need to enroll in this course to access the lessons.
          </div>
        )}

        <ul className="space-y-3">
          {currentCourse.lessons.map((lesson) => {
            const lessonProgress = courseProgress?.lessons[lesson.id];
            const isCompleted = lessonProgress?.isCompleted || false;
            const isActive = lesson.id === selectedLessonId;

            return (
              <li
                key={lesson.id}
                className={`px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : isCompleted
                    ? "bg-green-50 border-green-200 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-sm"
                }`}
                onClick={() => handleLessonSelect(lesson.id)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {isCompleted && (
                    <FaCheckCircle className="text-green-600 text-sm flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {lesson.title}
                  </span>
                </div>

                {isEnrolled && (
                  <Button
                    size="sm"
                    variant={isCompleted ? "secondary" : "primary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLessonComplete(lesson.id, !isCompleted);
                    }}
                    className="flex-shrink-0 ml-3"
                  >
                    {isCompleted ? "Undo" : "Done"}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>

        {!isEnrolled && (
          <div className="mt-4">
            {isAuthenticated ? (
              <Button
                fullWidth
                onClick={() => {
                  /* TODO: Implement enrollment */
                }}
              >
                Enroll in Course
              </Button>
            ) : (
              <Button
                fullWidth
                className="opacity-75 cursor-not-allowed"
                onClick={() => alert("Please log in to enroll in this course.")}
              >
                <FaLock className="mr-2" /> Login to Enroll
              </Button>
            )}
          </div>
        )}
      </aside>

      <main className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{currentCourse.title}</h1>
          {isEnrolled ? (
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Enrolled
            </span>
          ) : (
            <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Not Enrolled
            </span>
          )}
        </div>

        {isEnrolled && (
          <div className="mb-6">
            {isCompleted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center text-green-700 mb-2">
                  <FaTrophy className="mr-2" />
                  <span className="font-semibold">Congratulations!</span>
                </div>
                <p className="text-green-600 text-sm">
                  You have successfully completed this course. All lessons are
                  done!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {selectedLesson ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedLesson.title}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToPreviousLesson}
                  disabled={
                    currentCourse.lessons.findIndex(
                      (l) => l.id === selectedLessonId
                    ) <= 0
                  }
                >
                  <FaArrowLeft className="mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={goToNextLesson}
                  disabled={
                    currentCourse.lessons.findIndex(
                      (l) => l.id === selectedLessonId
                    ) >=
                    currentCourse.lessons.length - 1
                  }
                >
                  Next
                  <FaArrowRight className="ml-1" />
                </Button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedLesson.content}
              </p>

              {selectedLesson.duration && (
                <div className="text-sm text-gray-500 mb-4">
                  <FaPlay className="inline mr-2" />
                  Duration: {selectedLesson.duration} minutes
                </div>
              )}

              {selectedLesson.resources && (
                <div className="mt-6">
                  <h4 className="text-gray-800 font-medium mb-3">Resources</h4>
                  <div className="space-y-2">
                    {JSON.parse(selectedLesson.resources).map(
                      (
                        resource: { label: string; url: string },
                        index: number
                      ) => (
                        <a
                          key={index}
                          href={resource.url}
                          className="block text-blue-600 hover:text-blue-800 hover:underline p-2 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource.label}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaBookOpen className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>Select a lesson from the curriculum to get started</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseReader;
