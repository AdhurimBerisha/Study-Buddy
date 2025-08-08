import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import groupReducer from "./slice/groupsSlice";
import chatReducer from "./slice/chatSlice";
import learningReducer from "./slice/learningSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
    chat: chatReducer,
    learning: learningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
