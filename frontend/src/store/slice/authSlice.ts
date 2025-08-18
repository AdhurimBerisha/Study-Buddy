import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../services/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "user" | "tutor" | "admin";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  redirectTo?: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  redirectTo: undefined,
};

const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user, redirectTo } = response.data;
    localStorage.setItem("token", token);
    return { token, user, redirectTo };
  }
);

const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken: string) => {
    const response = await api.post("/auth/google", { token: googleToken });
    const { token, user, redirectTo } = response.data;
    localStorage.setItem("token", token);
    return { token, user, redirectTo };
  }
);

const register = createAsyncThunk(
  "auth/register",
  async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    return response.data;
  }
);

const fetchProfile = createAsyncThunk("auth/fetchProfile", async () => {
  const response = await api.get("/users/me");
  return response.data.data || response.data;
});

const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: { profileData?: Partial<User>; avatarFile?: File }) => {
    const { profileData, avatarFile } = data;

    if (avatarFile) {
      const formData = new FormData();
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value);
          }
        });
      }
      formData.append("avatar", avatarFile);

      const response = await api.put("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data || response.data;
    } else {
      const response = await api.put("/users/me", profileData || {});
      return response.data.data || response.data;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.redirectTo = undefined;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearRedirect: (state) => {
      state.redirectTo = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.redirectTo = action.payload.redirectTo;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.redirectTo = action.payload.redirectTo;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Google login failed";
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });

    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      });
  },
});

export default authSlice.reducer;

export const {
  logout,
  clearError,
  setLoading,
  setError,
  setUser,
  setToken,
  clearRedirect,
} = authSlice.actions;

export { login, googleLogin, register, fetchProfile, updateProfile };
