import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import chatReducer from "./slice/chatSlice";
import groupsReducer from "./slice/groupsSlice";
import learningReducer from "./slice/learningSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    groups: groupsReducer,
    learning: learningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
