import { createSlice } from "@reduxjs/toolkit";

// Define the expected structure of userData
const validateUserData = (data) => {

  if (
    typeof data !== "object" ||
    data === null ||
    !data.hasOwnProperty("_id") ||
    !data.hasOwnProperty("email")
  ) {
    throw new Error(
      "ERROR :: Invalid userData format. Expected an object with _id, username, email, and role."
    );
  }
};

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      try {
        validateUserData(action.payload);
        state.status = true;
        state.userData = action.payload;
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
