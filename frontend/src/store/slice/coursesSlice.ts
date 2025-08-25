import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string;
  totalLessons?: number;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  enrollmentCount?: number;
  isEnrolled?: boolean;
  enrollment?: {
    progress: number;
    enrolledAt: string;
    completedAt?: string;
    lastAccessedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CoursesState {
  courses: Course[];
  myCourses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    level?: string;
    search?: string;
  };
}

const initialState: CoursesState = {
  courses: [],
  myCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (filters?: { category?: string; level?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.level) params.append("level", filters.level);
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(`/api/courses?${params.toString()}`);
    return response.data;
  }
);

export const fetchCourse = createAsyncThunk(
  "courses/fetchCourse",
  async (courseId: string) => {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: {
    title: string;
    description: string;
    category: string;
    level: "beginner" | "intermediate" | "advanced";
    price?: number;
    thumbnail?: string;
    totalLessons?: number;
    tutorId: string;
  }) => {
    const response = await api.post("/api/courses", courseData);
    return response.data;
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({
    courseId,
    courseData,
  }: {
    courseId: string;
    courseData: Partial<Course>;
  }) => {
    const response = await api.put(`/api/courses/${courseId}`, courseData);
    return response.data;
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId: string) => {
    await api.delete(`/api/courses/${courseId}`);
    return courseId;
  }
);

export const enrollInCourse = createAsyncThunk(
  "courses/enrollInCourse",
  async (courseId: string) => {
    await api.post(`/api/courses/${courseId}/enroll`);
    return courseId;
  }
);

export const unenrollFromCourse = createAsyncThunk(
  "courses/unenrollFromCourse",
  async (courseId: string) => {
    await api.delete(`/api/courses/${courseId}/enroll`);
    return courseId;
  }
);

export const fetchMyCourses = createAsyncThunk(
  "courses/fetchMyCourses",
  async () => {
    const response = await api.get("/api/courses/my/enrolled");
    return response.data;
  }
);

export const updateCourseProgress = createAsyncThunk(
  "courses/updateCourseProgress",
  async ({ courseId, progress }: { courseId: string; progress: number }) => {
    await api.put(`/api/courses/${courseId}/progress`, { progress });
    return { courseId, progress };
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch courses";
      });

    builder
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch course";
      });

    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create course";
      });

    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (course) => course.id === action.payload.id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update course";
      });

    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course.id !== action.payload
        );
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete course";
      });

    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        const courseIndex = state.courses.findIndex(
          (course) => course.id === action.payload
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex].isEnrolled = true;
          if (state.courses[courseIndex].enrollmentCount !== undefined) {
            state.courses[courseIndex].enrollmentCount! += 1;
          }
        }
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse.isEnrolled = true;
          if (state.currentCourse.enrollmentCount !== undefined) {
            state.currentCourse.enrollmentCount += 1;
          }
        }
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to enroll in course";
      });

    builder
      .addCase(unenrollFromCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.loading = false;
        const courseIndex = state.courses.findIndex(
          (course) => course.id === action.payload
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex].isEnrolled = false;
          if (state.courses[courseIndex].enrollmentCount !== undefined) {
            state.courses[courseIndex].enrollmentCount! -= 1;
          }
        }
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse.isEnrolled = false;
          if (state.currentCourse.enrollmentCount !== undefined) {
            state.currentCourse.enrollmentCount -= 1;
          }
        }
        state.myCourses = state.myCourses.filter(
          (course) => course.id !== action.payload
        );
        state.error = null;
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to unenroll from course";
      });

    builder
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload;
        state.error = null;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch enrolled courses";
      });

    builder
      .addCase(updateCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, progress } = action.payload;

        const myCourseIndex = state.myCourses.findIndex(
          (course) => course.id === courseId
        );
        if (myCourseIndex !== -1 && state.myCourses[myCourseIndex].enrollment) {
          state.myCourses[myCourseIndex].enrollment!.progress = progress;
          if (progress === 100) {
            state.myCourses[myCourseIndex].enrollment!.completedAt =
              new Date().toISOString();
          }
        }

        if (
          state.currentCourse?.id === courseId &&
          state.currentCourse.enrollment
        ) {
          state.currentCourse.enrollment.progress = progress;
          if (progress === 100) {
            state.currentCourse.enrollment.completedAt =
              new Date().toISOString();
          }
        }

        state.error = null;
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update course progress";
      });
  },
});

export default coursesSlice.reducer;

export const { clearError, setFilters, clearFilters, clearCurrentCourse } =
  coursesSlice.actions;
