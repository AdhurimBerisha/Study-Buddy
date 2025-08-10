import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  token: string | null;
  loading: boolean;
  error: string | null;
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
        isAuthenticated:
          !!parsed.isAuthenticated && !!parsed.currentUser && !!parsed.token,
        token: parsed.token || null,
        loading: false,
        error: null,
      } as AuthState;
    }
  } catch (err) {
    console.log(err);
  }
  return {
    users: [],
    currentUser: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
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
        token: state.token,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

const initialState: AuthState = loadInitialAuthState();

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
                user {
                  id
                  email
                  firstName
                  lastName
                  phone
                }
              }
            }
          `,
          variables: credentials,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data.data.login;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      throw new Error(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateUser($email: String!, $password: String!, $firstName: String!, $lastName: String!, $phone: String) {
              createUser(email: $email, password: $password, firstName: $firstName, lastName: $lastName, phone: $phone) {
                id
                email
                firstName
                lastName
                phone
              }
            }
          `,
          variables: userData,
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data.data.createUser;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      throw new Error(errorMessage);
    }
  }
);

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { state: { auth: AuthState }; rejectValue: string | null }
>("auth/fetchUserProfile", async (_: void, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue(null);
    }

    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
            query {
              myProfile {
                id
                email
                firstName
                lastName
                phone
              }
            }
          `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return thunkAPI.rejectWithValue(
        data.errors[0].message ?? "Failed to fetch profile"
      );
    }

    return data.data.myProfile as User;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch profile";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      persistAuth(state);
    },
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
      state.token = null;
      persistAuth(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        persistAuth(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        persistAuth(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });

    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        persistAuth(state);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string | null) ?? null;
      });
  },
});

export const { register, loginSuccess, logout, clearError, setCredentials } =
  authSlice.actions;
export default authSlice.reducer;
