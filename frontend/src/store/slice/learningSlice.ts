import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCurriculumBySlug } from "../../pages/Courses/curriculum";

type CourseProgress = {
  completedLessonIds: string[];
  lastLessonId?: string;
};

export interface LearningState {
  enrolledCourseSlugs: string[];
  progressByCourseSlug: Record<string, CourseProgress>;
  wishlist: string[];
  following: string[];
  purchasedCourseSlugs: string[];
  completedCourseSlugs: string[];
}

const LOCAL_STORAGE_KEY = "studybuddy_learning_state_v1";

function loadInitialState(): LearningState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LearningState>;
      return {
        enrolledCourseSlugs: parsed.enrolledCourseSlugs || [],
        progressByCourseSlug: parsed.progressByCourseSlug || {},
        wishlist: parsed.wishlist || [],
        following: parsed.following || [],
        purchasedCourseSlugs: parsed.purchasedCourseSlugs || [],
        completedCourseSlugs: parsed.completedCourseSlugs || [],
      };
    }
  } catch (err) {
    console.log(err);
  }
  return {
    enrolledCourseSlugs: [],
    progressByCourseSlug: {},
    wishlist: [],
    following: [],
    purchasedCourseSlugs: [],
    completedCourseSlugs: [],
  };
}

function persist(state: LearningState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.log(err);
  }
}

const initialState: LearningState = loadInitialState();

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    purchaseCourse: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (!state.purchasedCourseSlugs.includes(slug)) {
        state.purchasedCourseSlugs.push(slug);
      }
      persist(state);
    },
    enrollCourse: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (!state.enrolledCourseSlugs.includes(slug)) {
        state.enrolledCourseSlugs.push(slug);
      }
      if (!state.progressByCourseSlug[slug]) {
        state.progressByCourseSlug[slug] = { completedLessonIds: [] };
      }
      persist(state);
    },
    unenrollCourse: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      state.enrolledCourseSlugs = state.enrolledCourseSlugs.filter(
        (s) => s !== slug
      );
      delete state.progressByCourseSlug[slug];
      persist(state);
    },
    toggleLessonComplete: (
      state,
      action: PayloadAction<{ slug: string; lessonId: string }>
    ) => {
      const { slug, lessonId } = action.payload;
      const progress =
        state.progressByCourseSlug[slug] ||
        (state.progressByCourseSlug[slug] = { completedLessonIds: [] });
      const idx = progress.completedLessonIds.indexOf(lessonId);
      if (idx >= 0) progress.completedLessonIds.splice(idx, 1);
      else progress.completedLessonIds.push(lessonId);

      const curriculum = getCurriculumBySlug(slug);
      const totalLessons = curriculum.length;
      const completedCount = progress.completedLessonIds.length;

      if (completedCount === totalLessons && totalLessons > 0) {
        if (!state.completedCourseSlugs.includes(slug)) {
          state.completedCourseSlugs.push(slug);
        }
      } else {
        state.completedCourseSlugs = state.completedCourseSlugs.filter(
          (s) => s !== slug
        );
      }

      persist(state);
    },
    clearCourseProgress: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      state.progressByCourseSlug[slug] = { completedLessonIds: [] };
      persist(state);
    },
    setLastLesson: (
      state,
      action: PayloadAction<{ slug: string; lessonId: string }>
    ) => {
      const { slug, lessonId } = action.payload;
      const progress =
        state.progressByCourseSlug[slug] ||
        (state.progressByCourseSlug[slug] = { completedLessonIds: [] });
      progress.lastLessonId = lessonId;
      persist(state);
    },
    toggleFollowCourse: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      const i = state.following.indexOf(slug);
      if (i >= 0) state.following.splice(i, 1);
      else state.following.push(slug);
      persist(state);
    },
    toggleWishlistCourse: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      const i = state.wishlist.indexOf(slug);
      if (i >= 0) state.wishlist.splice(i, 1);
      else state.wishlist.push(slug);
      persist(state);
    },
  },
});

export const {
  purchaseCourse,
  enrollCourse,
  unenrollCourse,
  toggleLessonComplete,
  setLastLesson,
  toggleFollowCourse,
  toggleWishlistCourse,
} = learningSlice.actions;

export default learningSlice.reducer;
