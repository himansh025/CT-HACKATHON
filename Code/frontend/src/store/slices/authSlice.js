import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user } = action.payload;
      state.status = true;
      state.user = user;
      localStorage.setItem("authUser", JSON.stringify(user)); // optional
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      localStorage.removeItem("authUser");
    },
    // --- FIX: New reducer to update partial user details (e.g., interests) ---
    setUserDetails: (state, action) => {
      // Safely merge the new details into the existing user object
      state.user = { ...state.user, ...action.payload };
      // Update localStorage to persist the change (recommended)
      if (state.user) {
        localStorage.setItem("authUser", JSON.stringify(state.user));
      }
    },
  },
});

// Export the new action along with the existing ones
export const { login, logout, setUserDetails } = authSlice.actions;

export default authSlice.reducer;
