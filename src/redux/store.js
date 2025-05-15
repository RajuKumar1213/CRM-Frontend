import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import notificationReducer from "./features/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer
  },
});



