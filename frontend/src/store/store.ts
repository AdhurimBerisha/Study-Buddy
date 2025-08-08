import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import groupReducer from "./slice/groupsSlice";
import chatReducer from "./slice/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
