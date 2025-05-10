import { createSlice } from "@reduxjs/toolkit";

// Validate user data structure
const validateUserData = (data) => {
  if (
    typeof data !== "object" ||
    data === null ||
    !data.hasOwnProperty("_id") ||
    !data.hasOwnProperty("email")
  ) {
    throw new Error(
      "ERROR :: Invalid userData format. Expected an object with _id, email, and other required fields."
    );
  }
  return true;
};

const initialState = {
  status: false,
  userData: null,
  lastAuthenticated: null,
  authError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      try {
        if (validateUserData(action.payload)) {
          state.status = true;
          state.userData = action.payload;
          state.lastAuthenticated = new Date().toISOString();
          state.authError = null;
        }
      } catch (error) {
        console.error("Login action error:", error.message);
        state.authError = error.message;
      }
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.lastAuthenticated = null;
      state.authError = null;
    },
    updateUserData: (state, action) => {
      try {
        if (state.status && state.userData) {
          state.userData = {
            ...state.userData,
            ...action.payload
          };
        }
      } catch (error) {
        console.error("Update user data error:", error.message);
      }
    },
    setAuthError: (state, action) => {
      state.authError = action.payload;
    },
    clearAuthError: (state) => {
      state.authError = null;
    }
  },
});

export const { login, logout, updateUserData, setAuthError, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
