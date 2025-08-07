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

const initialState: AuthState = {
  users: [],
  currentUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<User>) => {
      if (!action.payload.avatar) {
        action.payload.avatar = null;
      }
      state.users.push(action.payload);
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { register, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
