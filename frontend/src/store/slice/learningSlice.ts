import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../services/api";
import { lessonAPI } from "../../services/api";

// Types for the new backend system
export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  duration?: number;
  resources?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithLessons {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  imageUrl: string;
  duration: number;
  createdBy: string;
  lessons: Lesson[];
  totalLessons: number;
}

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent?: number;
  lastAccessedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  lessons: Record<string, LessonProgress>;
  lastAccessedAt?: string;
}

export interface LearningState {
  // Course data
  currentCourse: CourseWithLessons | null;
  currentLesson: Lesson | null;

  // Progress tracking
  courseProgress: Record<string, CourseProgress>;

  // UI state
  loading: boolean;
  error: string | null;

  // Wishlist and following (kept from original)
  wishlist: string[];
  following: string[];
}

const initialState: LearningState = {
  currentCourse: null,
  currentLesson: null,
  courseProgress: {},
  loading: false,
  error: null,
  wishlist: [],
  following: [],
};

// Async thunks for backend integration
export const fetchCourseWithLessons = createAsyncThunk(
  "learning/fetchCourseWithLessons",
  async (courseId: string) => {
    const response = await lessonAPI.getCourseLessons(courseId);
    return { ...response.data, courseId };
  }
);

export const fetchLesson = createAsyncThunk(
  "learning/fetchLesson",
  async (lessonId: string) => {
    const response = await lessonAPI.getLesson(lessonId);
    return response.data;
  }
);

export const fetchCourseProgress = createAsyncThunk(
  "learning/fetchCourseProgress",
  async (courseId: string) => {
    const response = await lessonAPI.getCourseProgress(courseId);
    return { ...response.data, courseId };
  }
);

export const updateLessonProgress = createAsyncThunk(
  "learning/updateLessonProgress",
  async ({
    courseId,
    lessonId,
    isCompleted,
    timeSpent,
  }: {
    courseId: string;
    lessonId: string;
    isCompleted?: boolean;
    timeSpent?: number;
  }) => {
    const response = await lessonAPI.updateLessonProgress(lessonId, {
      isCompleted,
      timeSpent,
    });
    return { ...response.data, courseId };
  }
);

export const purchaseCourse = createAsyncThunk(
  "learning/purchaseCourse",
  async (courseId: string) => {
    await api.post(`/courses/${courseId}/purchase`);
    return courseId;
  }
);

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Set current course and lesson
    setCurrentCourse: (
      state,
      action: PayloadAction<CourseWithLessons | null>
    ) => {
      state.currentCourse = action.payload;
    },

    setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
      state.currentLesson = action.payload;
    },

    // Local progress updates (for immediate UI feedback)
    markLessonComplete: (
      state,
      action: PayloadAction<{ courseId: string; lessonId: string }>
    ) => {
      const { courseId, lessonId } = action.payload;

      if (!state.courseProgress[courseId]) {
        state.courseProgress[courseId] = {
          courseId,
          totalLessons: 0,
          completedLessons: 0,
          completionPercentage: 0,
          lessons: {},
        };
      }

      const progress = state.courseProgress[courseId];
      if (!progress.lessons[lessonId]) {
        progress.lessons[lessonId] = {
          lessonId,
          isCompleted: false,
        };
      }

      progress.lessons[lessonId].isCompleted = true;
      progress.lessons[lessonId].completedAt = new Date().toISOString();

      // Recalculate completion stats
      const completedCount = Object.values(progress.lessons).filter(
        (l) => l.isCompleted
      ).length;
      progress.completedLessons = completedCount;

      if (progress.totalLessons > 0) {
        progress.completionPercentage = Math.round(
          (completedCount / progress.totalLessons) * 100
        );
      }
    },

    markLessonIncomplete: (
      state,
      action: PayloadAction<{ courseId: string; lessonId: string }>
    ) => {
      const { courseId, lessonId } = action.payload;

      if (state.courseProgress[courseId]?.lessons[lessonId]) {
        state.courseProgress[courseId].lessons[lessonId].isCompleted = false;
        state.courseProgress[courseId].lessons[lessonId].completedAt =
          undefined;

        // Recalculate completion stats
        const progress = state.courseProgress[courseId];
        const completedCount = Object.values(progress.lessons).filter(
          (l) => l.isCompleted
        ).length;
        progress.completedLessons = completedCount;

        if (progress.totalLessons > 0) {
          progress.completionPercentage = Math.round(
            (completedCount / progress.totalLessons) * 100
          );
        }
      }
    },

    // Wishlist and following (kept from original)
    toggleFollowCourse: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      const index = state.following.indexOf(courseId);
      if (index >= 0) {
        state.following.splice(index, 1);
      } else {
        state.following.push(courseId);
      }
    },

    toggleWishlistCourse: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      const index = state.wishlist.indexOf(courseId);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(courseId);
      }
    },

    // Reset state
    resetLearningState: (state) => {
      state.currentCourse = null;
      state.currentLesson = null;
      state.courseProgress = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch enrolled courses
    // Fetch course with lessons
    builder
      .addCase(fetchCourseWithLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseWithLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCourseWithLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course lessons";
      });

    // Fetch lesson
    builder
      .addCase(fetchLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload.data;
        state.error = null;
      })
      .addCase(fetchLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lesson";
      });

    // Fetch course progress
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId } = action.payload;
        const { lessons, progress } = action.payload.data;

        console.log("🔄 Redux: fetchCourseProgress.fulfilled", {
          courseId,
          lessons: lessons.length,
          progress,
        });

        // Create progress record
        state.courseProgress[courseId] = {
          courseId,
          totalLessons: progress.totalLessons,
          completedLessons: progress.completedLessons,
          completionPercentage: progress.completionPercentage,
          lessons: {},
        };

        // Map lesson progress
        lessons.forEach((lesson: { id: string; progress?: LessonProgress }) => {
          if (lesson.progress) {
            state.courseProgress[courseId].lessons[lesson.id] = {
              lessonId: lesson.id,
              isCompleted: lesson.progress.isCompleted,
              completedAt: lesson.progress.completedAt,
              timeSpent: lesson.progress.timeSpent,
              lastAccessedAt: lesson.progress.lastAccessedAt,
            };
          }
        });

        console.log("✅ Redux: Course progress initialized", {
          courseId,
          progressRecord: state.courseProgress[courseId],
          allCourseProgress: Object.keys(state.courseProgress),
        });

        state.error = null;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course progress";
      });

    // Update lesson progress
    builder
      .addCase(updateLessonProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, lessonId, isCompleted, timeSpent, lastAccessedAt } =
          action.payload;

        console.log("🔄 Redux: updateLessonProgress.fulfilled", {
          courseId,
          lessonId,
          isCompleted,
          payload: action.payload,
        });

        // Use the courseId from the action payload
        if (courseId && state.courseProgress[courseId]) {
          if (!state.courseProgress[courseId].lessons[lessonId]) {
            state.courseProgress[courseId].lessons[lessonId] = {
              lessonId,
              isCompleted: false,
            };
          }

          const lessonProgress =
            state.courseProgress[courseId].lessons[lessonId];
          lessonProgress.isCompleted = isCompleted;
          lessonProgress.timeSpent = timeSpent;
          lessonProgress.lastAccessedAt = lastAccessedAt;

          if (isCompleted) {
            lessonProgress.completedAt = new Date().toISOString();
          } else {
            lessonProgress.completedAt = undefined;
          }

          console.log("✅ Redux: State updated", {
            courseId,
            lessonId,
            lessonProgress: state.courseProgress[courseId].lessons[lessonId],
            allProgress: state.courseProgress[courseId],
          });
        } else {
          console.log(
            "❌ Redux: No course progress found for courseId:",
            courseId
          );
        }

        state.error = null;
      })
      .addCase(updateLessonProgress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update lesson progress";
      });

    // Purchase course (full access)
    builder
      .addCase(purchaseCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(purchaseCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to purchase course";
      });
  },
});

export default learningSlice.reducer;

export const {
  clearError,
  setCurrentCourse,
  setCurrentLesson,
  markLessonComplete,
  markLessonIncomplete,
  toggleFollowCourse,
  toggleWishlistCourse,
  resetLearningState,
} = learningSlice.actions;

// Selectors
export const selectCurrentCourse = (state: RootState) =>
  state.learning.currentCourse;
export const selectCurrentLesson = (state: RootState) =>
  state.learning.currentLesson;
export const selectCourseProgress = (courseId: string) => (state: RootState) =>
  state.learning.courseProgress[courseId];
export const selectLessonProgress =
  (courseId: string, lessonId: string) => (state: RootState) =>
    state.learning.courseProgress[courseId]?.lessons[lessonId];
export const selectLearningLoading = (state: RootState) =>
  state.learning.loading;
export const selectLearningError = (state: RootState) => state.learning.error;
export const selectWishlist = (state: RootState) => state.learning.wishlist;
export const selectFollowing = (state: RootState) => state.learning.following;
