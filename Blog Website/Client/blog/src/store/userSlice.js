import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.loading = null;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateFailure: (state) => {
      state.loading = null;
      state.error = null;
    },
    deleteUserStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    deleteUserSuccess: (state) => {
      state.loading = null;
      state.currentUser = null;
      state.error = null;
    },
    deleteUseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signOutFailure: (state, action) => {
      state.loading = null;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.loading = null;
      state.currentUser = null;
      state.error = null;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUseFailure,
  signOutSuccess,
  signOutFailure,
} = userSlice.actions;
export default userSlice;
