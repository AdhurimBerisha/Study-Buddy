import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import {
  fetchCourseWithLessons,
  fetchLesson,
  fetchCourseProgress,
  updateLessonProgress,
  purchaseCourse,
  setCurrentCourse,
  setCurrentLesson,
  clearError,
  resetLearningState,
  selectCurrentCourse,
  selectCurrentLesson,
  selectCourseProgress,
  selectLearningLoading,
  selectLearningError,
  selectWishlist,
  selectFollowing,
  toggleFollowCourse,
  toggleWishlistCourse,
} from "../store/slice/learningSlice";
import type { CourseWithLessons, Lesson } from "../store/slice/learningSlice";
import { purchaseAPI } from "../services/api";

export const useLearning = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentCourse = useSelector(selectCurrentCourse);
  const currentLesson = useSelector(selectCurrentLesson);
  const loading = useSelector(selectLearningLoading);
  const error = useSelector(selectLearningError);
  const wishlist = useSelector(selectWishlist);
  const following = useSelector(selectFollowing);

  const courseProgress = useSelector(
    selectCourseProgress(currentCourse?.id || "")
  );

  const loadCourseWithLessons = useCallback(
    async (courseId: string) => {
      try {
        await dispatch(fetchCourseWithLessons(courseId)).unwrap();
      } catch (error) {
        console.error("Failed to load course lessons:", error);
      }
    },
    [dispatch]
  );

  const loadLesson = useCallback(
    async (lessonId: string) => {
      try {
        await dispatch(fetchLesson(lessonId)).unwrap();
      } catch (error) {
        console.error("Failed to load lesson:", error);
      }
    },
    [dispatch]
  );

  const loadCourseProgress = useCallback(
    async (courseId: string) => {
      try {
        await dispatch(fetchCourseProgress(courseId)).unwrap();
      } catch (error) {
        console.error("Failed to load course progress:", error);
      }
    },
    [dispatch]
  );

  const loadLearningDashboard = useCallback(async () => {
    try {
      const response = await purchaseAPI.getLearningDashboard();
      return response.data.data;
    } catch (error) {
      console.error("Failed to load learning dashboard:", error);
      return [];
    }
  }, []);

  const purchaseCourseAction = useCallback(
    async (courseId: string) => {
      try {
        await dispatch(purchaseCourse(courseId)).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to purchase course:", error);
        return false;
      }
    },
    [dispatch]
  );

  const updateLessonProgressAction = useCallback(
    async (
      courseId: string,
      lessonId: string,
      isCompleted?: boolean,
      timeSpent?: number
    ) => {
      try {
        await dispatch(
          updateLessonProgress({ courseId, lessonId, isCompleted, timeSpent })
        ).unwrap();
        return true;
      } catch (error) {
        console.error("Failed to update lesson progress:", error);
        return false;
      }
    },
    [dispatch]
  );

  const markLessonCompleteAction = useCallback(
    async (courseId: string, lessonId: string) => {
      try {
        await dispatch(
          updateLessonProgress({ courseId, lessonId, isCompleted: true })
        ).unwrap();

        return true;
      } catch (error) {
        console.error("Failed to mark lesson as complete:", error);
        return false;
      }
    },
    [dispatch]
  );

  const markLessonIncompleteAction = useCallback(
    async (courseId: string, lessonId: string) => {
      try {
        await dispatch(
          updateLessonProgress({ courseId, lessonId, isCompleted: false })
        ).unwrap();

        return true;
      } catch (error) {
        console.error("Failed to mark lesson as incomplete:", error);
        return false;
      }
    },
    [dispatch]
  );

  const setCurrentCourseAction = useCallback(
    (course: CourseWithLessons | null) => {
      dispatch(setCurrentCourse(course));
    },
    [dispatch]
  );

  const setCurrentLessonAction = useCallback(
    (lesson: Lesson | null) => {
      dispatch(setCurrentLesson(lesson));
    },
    [dispatch]
  );

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetLearningStateAction = useCallback(() => {
    dispatch(resetLearningState());
  }, [dispatch]);

  const toggleFollowCourseAction = useCallback(
    (courseId: string) => {
      dispatch(toggleFollowCourse(courseId));
    },
    [dispatch]
  );

  const toggleWishlistCourseAction = useCallback(
    (courseId: string) => {
      dispatch(toggleWishlistCourse(courseId));
    },
    [dispatch]
  );

  const navigateToCourse = useCallback(
    (courseId: string) => {
      navigate(`/learning/course/${courseId}`);
    },
    [navigate]
  );

  const navigateToLesson = useCallback(
    (courseId: string, lessonId: string) => {
      navigate(`/learning/course/${courseId}/lesson/${lessonId}`);
    },
    [navigate]
  );

  const navigateToMyLearning = useCallback(() => {
    navigate("/learning");
  }, [navigate]);

  const getCourseById = useCallback(
    (courseId: string) => {
      return currentCourse?.id === courseId ? currentCourse : null;
    },
    [currentCourse]
  );

  const getLessonById = useCallback(
    (lessonId: string) => {
      return currentCourse?.lessons.find((lesson) => lesson.id === lessonId);
    },
    [currentCourse]
  );

  const getNextLesson = useCallback(
    (currentLessonId: string) => {
      if (!currentCourse?.lessons) return null;
      const currentIndex = currentCourse.lessons.findIndex(
        (lesson) => lesson.id === currentLessonId
      );
      if (
        currentIndex === -1 ||
        currentIndex === currentCourse.lessons.length - 1
      )
        return null;
      return currentCourse.lessons[currentIndex + 1];
    },
    [currentCourse]
  );

  const getPreviousLesson = useCallback(
    (currentLessonId: string) => {
      if (!currentCourse?.lessons) return null;
      const currentIndex = currentCourse.lessons.findIndex(
        (lesson) => lesson.id === currentLessonId
      );
      if (currentIndex <= 0) return null;
      return currentCourse.lessons[currentIndex - 1];
    },
    [currentCourse]
  );

  const getCourseCompletionPercentage = useCallback(
    (courseId: string) => {
      const progress = courseProgress;
      return progress?.completionPercentage || 0;
    },
    [courseProgress]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      const progress = courseProgress?.lessons[lessonId];
      return progress?.isCompleted || false;
    },
    [courseProgress]
  );

  useEffect(() => {}, []);

  return {
    currentCourse,
    currentLesson,
    loading,
    error,
    wishlist,
    following,

    loadCourseWithLessons,
    loadLesson,
    loadCourseProgress,
    loadLearningDashboard,
    purchaseCourse: purchaseCourseAction,
    updateLessonProgress: updateLessonProgressAction,
    markLessonComplete: markLessonCompleteAction,
    markLessonIncomplete: markLessonIncompleteAction,
    setCurrentCourse: setCurrentCourseAction,
    setCurrentLesson: setCurrentLessonAction,
    clearError: clearErrorAction,
    resetLearningState: resetLearningStateAction,
    toggleFollowCourse: toggleFollowCourseAction,
    toggleWishlistCourse: toggleWishlistCourseAction,

    navigateToCourse,
    navigateToLesson,
    navigateToMyLearning,

    getCourseById,
    getLessonById,
    getNextLesson,
    getPreviousLesson,
    getCourseCompletionPercentage,
    isLessonCompleted,
    courseProgress,
  };
};
