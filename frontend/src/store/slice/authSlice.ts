import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string | null;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = "studybuddy_auth_v1";

function loadInitialAuthState(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      return {
        users: parsed.users || [],
        currentUser: parsed.currentUser || null,
        isAuthenticated: !!parsed.isAuthenticated && !!parsed.currentUser,
      } as AuthState;
    }
  } catch (err) {
    console.log(err);
  }
  return {
    users: [],
    currentUser: null,
    isAuthenticated: false,
  };
}

function persistAuth(state: AuthState) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

const initialState: AuthState = loadInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<User>) => {
      if (!action.payload.avatar) {
        action.payload.avatar = null;
      }
      state.users.push(action.payload);
      persistAuth(state);
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      persistAuth(state);
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      persistAuth(state);
    },
  },
});

export const { register, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
