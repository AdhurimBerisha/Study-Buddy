import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, NavLink } from "react-router-dom";
import type { RootState } from "../../store/store";
import Button from "../../components/Button";
import { courses, toCourseSlug } from "../Courses/data";
import { getCurriculumBySlug } from "../Courses/curriculum";
import {
  enrollCourse,
  toggleLessonComplete,
  setLastLesson,
} from "../../store/slice/learningSlice";
import { FaTrophy, FaLock } from "react-icons/fa";

const CourseReader = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const {
    enrolledCourseSlugs,
    purchasedCourseSlugs,
    progressByCourseSlug,
    completedCourseSlugs,
  } = useSelector((s: RootState) => s.learning);
  const { user } = useSelector((s: RootState) => s.auth);
  const isAuthenticated = !!user;

  const course = useMemo(
    () => courses.find((c) => toCourseSlug(c.language) === slug),
    [slug]
  );

  const progress = slug
    ? progressByCourseSlug[slug] || { completedLessonIds: [] }
    : { completedLessonIds: [] };
  const allLessons = slug ? getCurriculumBySlug(slug) : [];
  const isPurchased = slug ? purchasedCourseSlugs.includes(slug) : false;
  const halfCount = Math.max(1, Math.floor(allLessons.length / 2));
  const lessons = isPurchased ? allLessons : allLessons.slice(0, halfCount);
  const completedCount = progress.completedLessonIds.length;
  const totalCount = lessons.length || 1;
  const percent = Math.min(
    100,
    Math.round((completedCount / totalCount) * 100)
  );
  const isEnrolled = slug ? enrolledCourseSlugs.includes(slug) : false;
  const isCompleted = slug ? completedCourseSlugs.includes(slug) : false;

  const initialSelectedId = progress.lastLessonId || (lessons[0]?.id ?? "");
  const [selectedLessonId, setSelectedLessonId] =
    useState<string>(initialSelectedId);

  useEffect(() => {
    if (selectedLessonId && slug) {
      dispatch(setLastLesson({ slug, lessonId: selectedLessonId }));
    }
  }, [selectedLessonId, dispatch, slug]);

  const selectedLesson =
    lessons.find((l) => l.id === selectedLessonId) || lessons[0];

  const goPrev = () => {
    if (!selectedLesson) return;
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (idx > 0) setSelectedLessonId(lessons[idx - 1].id);
  };

  const goNext = () => {
    if (!selectedLesson) return;
    const idx = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (idx >= 0 && idx < lessons.length - 1)
      setSelectedLessonId(lessons[idx + 1].id);
  };

  if (!slug || !course) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 mb-4">Course not found.</p>
        <Link to="/courses">
          <Button>Back to courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <aside className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Curriculum</h2>
        {!isPurchased && allLessons.length > 0 && (
          <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
            Demo access: You can view {halfCount} of {allLessons.length}{" "}
            lessons. Purchase to unlock the full course.
          </div>
        )}
        <ul className="space-y-2">
          {lessons.map((item) => {
            const done = progress.completedLessonIds.includes(item.id);
            const isActive = item.id === selectedLessonId;
            return (
              <li
                key={item.id}
                className={`px-3 py-2 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-blue-50 border-blue-200"
                    : done
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedLessonId(item.id)}
              >
                <span className="text-sm font-medium truncate">
                  {item.title}
                </span>
                {isEnrolled && (
                  <Button
                    size="sm"
                    variant={done ? "secondary" : "primary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        toggleLessonComplete({ slug, lessonId: item.id })
                      );
                    }}
                  >
                    {done ? "Undo" : "Done"}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
        {!isPurchased && allLessons.length > lessons.length && (
          <div className="mt-4">
            {isAuthenticated ? (
              <NavLink
                to="/checkout"
                state={{
                  type: "course",
                  course: { title: course.language, price: course.price },
                }}
                className="block"
              >
                <Button fullWidth>Buy course to unlock all lessons</Button>
              </NavLink>
            ) : (
              <Button
                fullWidth
                className="opacity-75 cursor-not-allowed"
                onClick={() => alert("Please log in to purchase this course.")}
              >
                <FaLock className="mr-2" /> Login to Buy Course
              </Button>
            )}
          </div>
        )}
      </aside>

      <main className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{course.language}</h1>
          {!isEnrolled ? (
            isAuthenticated ? (
              <Button onClick={() => dispatch(enrollCourse(slug))}>
                Enroll
              </Button>
            ) : (
              <Button
                className="opacity-75 cursor-not-allowed"
                onClick={() => alert("Please log in to enroll in the demo.")}
              >
                <FaLock className="mr-2" /> Login to Enroll (demo)
              </Button>
            )
          ) : (
            <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Enrolled
            </span>
          )}
        </div>
        {isPurchased && (
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
                  <span>{percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      isCompleted ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {selectedLesson && (
          <>
            <p className="text-gray-700 leading-relaxed mb-6">
              This course contains general content, reading materials, and
              exercises. Use the curriculum on the left to navigate lessons and
              mark them complete.
            </p>

            <section className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {selectedLesson.title}
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={goPrev}>
                    Previous
                  </Button>
                  <Button size="sm" onClick={goNext}>
                    Next
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{selectedLesson.content}</p>
              {selectedLesson.resources &&
                selectedLesson.resources.length > 0 && (
                  <div className="text-sm">
                    <div className="text-gray-600 font-medium mb-2">
                      Resources
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedLesson.resources.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r.url}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {r.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default CourseReader;
