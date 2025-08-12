import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import chatReducer from "./slice/chatSlice";
import groupsReducer from "./slice/groupsSlice";
import learningReducer from "./slice/learningSlice";
import coursesReducer from "./slice/coursesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    groups: groupsReducer,
    learning: learningReducer,
    courses: coursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
