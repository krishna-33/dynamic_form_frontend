import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  authToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.authToken = action.payload.token
    },
    signout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.authToken = null
    },
  },
});

export const { signin, signout } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export default authSlice;
