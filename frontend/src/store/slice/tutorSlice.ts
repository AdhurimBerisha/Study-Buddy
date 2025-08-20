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
  language?: string;
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
};

export const fetchTutorDashboardStats = createAsyncThunk(
  "tutor/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tutors/dashboard/stats");
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tutors/dashboard/courses");
      return response.data.data;
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
  async (courseData: any, { rejectWithValue }) => {
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
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
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
      // Courses
      .addCase(fetchTutorCourses.pending, (state) => {
        state.loadingCourses = true;
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.loadingCourses = false;
        state.courses = action.payload;
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.loadingCourses = false;
        state.message = action.payload as string;
      })
      // Create Course
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
      })
      .addCase(createTutorCourse.rejected, (state, action) => {
        state.message = action.payload as string;
        state.courseError = action.payload as string;
        state.creatingCourse = false;
      });
  },
});

export const { setShowCreateCourseForm, clearMessage, setMessage } =
  tutorSlice.actions;
export default tutorSlice.reducer;
