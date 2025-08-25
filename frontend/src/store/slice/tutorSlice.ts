import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  totalLessons?: number;
  price: number;
  tutorId?: string;
  createdAt: string;
  tutor?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  lessons?: {
    id: string;
    title: string;
    order: number;
    duration?: number;
    isActive: boolean;
  }[];
}

interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price?: number;
  thumbnail?: string;
  totalLessons?: number;
  lessons?: Array<{
    title: string;
    content: string;
    order: number;
    duration?: number;
    resources?: string;
  }>;
}

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

interface TutorState {
  stats: DashboardStats | null;
  courses: Course[];
  loadingStats: boolean;
  loadingCourses: boolean;
  showCreateCourseForm: boolean;
  message: string | null;
  creatingCourse: boolean;
  courseError: string | null;

  coursesPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: TutorState = {
  stats: null,
  courses: [],
  loadingStats: true,
  loadingCourses: true,
  showCreateCourseForm: false,
  message: null,
  creatingCourse: false,
  courseError: null,

  coursesPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
};

export const fetchTutorDashboardStats = createAsyncThunk(
  "tutor/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/tutors/dashboard/stats");
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchTutorCourses = createAsyncThunk(
  "tutor/fetchCourses",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 5 } = params;
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      const response = await api.get(
        `/api/tutors/dashboard/courses?${queryParams.toString()}`
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

export const createTutorCourse = createAsyncThunk(
  "tutor/createCourse",
  async (courseData: CreateCourseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tutors/courses", courseData);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create course"
      );
    }
  }
);

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setShowCreateCourseForm: (state, action) => {
      state.showCreateCourseForm = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    setCoursesPage: (state, action) => {
      state.coursesPagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTutorDashboardStats.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchTutorDashboardStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchTutorDashboardStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.message = action.payload as string;
      })

      .addCase(fetchTutorCourses.pending, (state) => {
        state.loadingCourses = true;
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.loadingCourses = false;
        state.courses = action.payload.data;
        if (action.payload.pagination) {
          state.coursesPagination = {
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalItems: action.payload.pagination.totalCourses,
            itemsPerPage: action.payload.pagination.coursesPerPage,
          };
        }
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.loadingCourses = false;
        state.message = action.payload as string;
      })

      .addCase(createTutorCourse.pending, (state) => {
        state.creatingCourse = true;
        state.courseError = null;
      })
      .addCase(createTutorCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
        state.message = "Course created successfully!";
        state.showCreateCourseForm = false;
        state.creatingCourse = false;
        state.courseError = null;

        state.coursesPagination.currentPage = 1;
      })
      .addCase(createTutorCourse.rejected, (state, action) => {
        state.message = action.payload as string;
        state.courseError = action.payload as string;
        state.creatingCourse = false;
      });
  },
});

export const {
  setShowCreateCourseForm,
  clearMessage,
  setMessage,
  setCoursesPage,
} = tutorSlice.actions;
export default tutorSlice.reducer;
