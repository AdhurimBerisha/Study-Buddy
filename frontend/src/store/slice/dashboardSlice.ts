import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface CourseData {
  title: string;
  description: string;
  category: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnail?: string;
  totalLessons: number;
  lessons: Array<{
    title: string;
    content: string;
    order: number;
    duration?: number | null;
    resources?: string | null;
  }>;
}

export const createCourse = createAsyncThunk(
  "dashboard/createCourse",
  async (courseData: CourseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tutors/courses", courseData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create course";
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    creatingCourse: false,
    courseError: null as string | null,
    courses: [],
    loading: false,
  },
  reducers: {
    clearCourseError: (state) => {
      state.courseError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.creatingCourse = true;
        state.courseError = null;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.creatingCourse = false;
        state.courseError = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.creatingCourse = false;
        state.courseError = action.payload as string;
      });
  },
});

export const { clearCourseError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
