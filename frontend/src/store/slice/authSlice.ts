import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    return { token, user };
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
  },
});

export default authSlice.reducer;

export const { logout, clearError, setLoading, setError, setUser, setToken } =
  authSlice.actions;

export { login, register, fetchProfile, updateProfile };
