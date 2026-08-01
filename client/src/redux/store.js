import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * redux/store.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Creates the single Redux store for the app via configureStore,
 * which wires up redux-thunk (needed for our async loginUser thunk)
 * and the Redux DevTools extension automatically. Currently only
 * `auth` state lives here, but additional slices could be added the
 * same way postsSlice/platformSlice would be in a bigger app.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
