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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  createdAt: string;
  tutorProfile?: {
    id: string;
    bio: string;
    expertise: string[];
    isVerified: boolean;
  } | null;
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
  tutorId?: string;
  createdAt: string;
  tutor?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface DashboardStats {
  users: {
    total: number;
    regular: number;
    admin: number;
    tutor: number;
    recent: number;
  };
  courses: {
    total: number;
    recent: number;
  };
  lessons: {
    total: number;
  };
  purchases: {
    total: number;
  };
}

interface Tutor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalLessons: number;
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminState {
  stats: DashboardStats | null;
  users: User[];
  courses: Course[];
  tutors: Tutor[];

  loadingStats: boolean;
  loadingUsers: boolean;
  loadingCourses: boolean;
  loadingTutors: boolean;

  showCreateUserForm: boolean;

  showEditCourseForm: string | null;
  showCreateTutorForm: boolean;
  showEditTutorForm: string | null;

  creatingUser: boolean;

  updatingCourse: boolean;
  deletingUserId: string | null;
  deletingCourseId: string | null;
  creatingTutor: boolean;
  updatingTutor: boolean;
  deletingTutorId: string | null;

  message: {
    type: "success" | "error";
    text: string;
  } | null;

  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  courses: [],
  tutors: [],

  loadingStats: false,
  loadingUsers: false,
  loadingCourses: false,
  loadingTutors: false,

  showCreateUserForm: false,

  showEditCourseForm: null,
  showCreateTutorForm: false,
  showEditTutorForm: null,

  creatingUser: false,

  updatingCourse: false,
  deletingUserId: null,
  deletingCourseId: null,
  creatingTutor: false,
  updatingTutor: false,
  deletingTutorId: null,

  message: null,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard/stats");
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch dashboard stats";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users");
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch users";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCourses = createAsyncThunk(
  "admin/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/courses");
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch courses";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTutors = createAsyncThunk(
  "admin/fetchTutors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/tutors");
      return response.data.data || [];
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch tutors";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
      avatar?: string;
      role: "user" | "tutor" | "admin";
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        return rejectWithValue(
          "A user with this email already exists. Please use a different email address."
        );
      }
      const errorMessage =
        apiError.response?.data?.message || "Failed to create user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async (
    { userId, role }: { userId: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      return { userId, role };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to change user role";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to delete user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "admin/updateCourse",
  async (
    {
      courseId,
      courseData,
    }: {
      courseId: string;
      courseData: {
        title: string;
        description: string;
        category: string;
        language: string;
        level: string;
        price: number;
        thumbnail: string;
        totalLessons: number;
        tutorId: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/admin/courses/${courseId}`, courseData);
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to update course";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "admin/deleteCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/courses/${courseId}`);
      return courseId;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to delete course";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTutor = createAsyncThunk(
  "admin/createTutor",
  async (
    tutorData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      avatar?: string;
      bio?: string;
      expertise: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/admin/tutors", tutorData);
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        return rejectWithValue(
          "A tutor with this email already exists. Please use a different email address."
        );
      }
      const errorMessage =
        apiError.response?.data?.message || "Failed to create tutor";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTutor = createAsyncThunk(
  "admin/updateTutor",
  async (
    {
      tutorId,
      tutorData,
    }: {
      tutorId: string;
      tutorData: {
        first_name?: string;
        last_name?: string;
        avatar?: string;
        bio?: string;
        expertise?: string[];
        isVerified?: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/admin/tutors/${tutorId}`, tutorData);
      return response.data.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to update tutor";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTutor = createAsyncThunk(
  "admin/deleteTutor",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/tutors/${tutorId}`);
      return tutorId;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to delete tutor";
      return rejectWithValue(errorMessage);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setShowCreateUserForm: (state, action) => {
      state.showCreateUserForm = action.payload;
    },

    setShowEditCourseForm: (state, action) => {
      state.showEditCourseForm = action.payload;
    },
    setShowCreateTutorForm: (state, action) => {
      state.showCreateTutorForm = action.payload;
    },
    setShowEditTutorForm: (state, action) => {
      state.showEditTutorForm = action.payload;
    },

    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loadingCourses = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loadingCourses = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loadingCourses = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchTutors.pending, (state) => {
        state.loadingTutors = true;
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loadingTutors = false;
        state.tutors = action.payload;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loadingTutors = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.creatingUser = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.creatingUser = false;
        state.users.unshift(action.payload);
        state.message = { type: "success", text: "User created successfully!" };
        state.showCreateUserForm = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.creatingUser = false;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.role = role;
        }
        state.message = {
          type: "success",
          text: "User role updated successfully!",
        };
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deletingUserId = null;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.message = { type: "success", text: "User deleted successfully!" };
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletingUserId = null;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(updateCourse.pending, (state) => {
        state.updatingCourse = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updatingCourse = false;
        const index = state.courses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        state.message = {
          type: "success",
          text: "Course updated successfully!",
        };
        state.showEditCourseForm = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updatingCourse = false;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(deleteCourse.pending, (state, action) => {
        state.deletingCourseId = action.meta.arg;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deletingCourseId = null;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        state.message = {
          type: "success",
          text: "Course deleted successfully!",
        };
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deletingCourseId = null;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(createTutor.pending, (state) => {
        state.creatingTutor = true;
        state.error = null;
      })
      .addCase(createTutor.fulfilled, (state, action) => {
        state.creatingTutor = false;
        state.tutors.unshift(action.payload);
        state.message = {
          type: "success",
          text: "Tutor created successfully!",
        };
        state.showCreateTutorForm = false;
      })
      .addCase(createTutor.rejected, (state, action) => {
        state.creatingTutor = false;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(updateTutor.pending, (state) => {
        state.updatingTutor = true;
        state.error = null;
      })
      .addCase(updateTutor.fulfilled, (state, action) => {
        state.updatingTutor = false;
        const index = state.tutors.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tutors[index] = action.payload;
        }
        state.message = {
          type: "success",
          text: "Tutor updated successfully!",
        };
        state.showEditTutorForm = null;
      })
      .addCase(updateTutor.rejected, (state, action) => {
        state.updatingTutor = false;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });

    builder
      .addCase(deleteTutor.pending, (state, action) => {
        state.deletingTutorId = action.meta.arg;
      })
      .addCase(deleteTutor.fulfilled, (state, action) => {
        state.deletingTutorId = null;
        state.tutors = state.tutors.filter((t) => t.id !== action.payload);
        state.message = {
          type: "success",
          text: "Tutor deleted successfully!",
        };
      })
      .addCase(deleteTutor.rejected, (state, action) => {
        state.deletingTutorId = null;
        state.error = action.payload as string;
        state.message = { type: "error", text: action.payload as string };
      });
  },
});

export const {
  setShowCreateUserForm,

  setShowEditCourseForm,
  setShowCreateTutorForm,
  setShowEditTutorForm,
  setMessage,
  clearMessage,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;
