import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import groupReducer from "./slice/groupsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
