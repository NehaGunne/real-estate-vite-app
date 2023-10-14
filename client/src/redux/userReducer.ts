import { createSlice } from "@reduxjs/toolkit";

interface UserObject {
  userName: string;
  email: string;
  photoURL: string;
  _id: string;
}

export interface UserState {
  user: null | UserObject;
  error: boolean;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  error: false,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state) => {
      state.error = true;
      state.loading = false;
    },
    userUpdateStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    userUpdateSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = false;
    },
    userUpdateFailure: (state) => {
      state.error = true;
      state.loading = false;
    },
    deleteUser: (state) => {
      state.user = null;
    },
    signOutUser: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  deleteUser,
  signOutUser,
} = userSlice.actions;

export default userSlice.reducer;
