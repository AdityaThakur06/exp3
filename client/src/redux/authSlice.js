import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosInstance';

/**
 * redux/authSlice.js
 * ------------------------------------------------------------------
 * HOW REDUX AUTHENTICATION WORKS HERE
 * This slice is the single source of truth for "who is logged in and
 * what can they do" across the whole app:
 *   - `user`            the decoded user profile (id/name/email/role)
 *   - `token`           the raw JWT string
 *   - `isAuthenticated` convenience boolean derived at login/restore
 *   - `loading`/`error` async status for the login request
 *
 * The `loginUser` thunk POSTs credentials to /api/login. On success,
 * we persist { token, user } to localStorage (so a page refresh
 * doesn't log the user out) and update Redux state via the
 * `fulfilled` case. Components read `isAuthenticated`/`user.role`
 * via useSelector to decide what to render (Navbar links, protected
 * routes, etc.) - none of them talk to localStorage or the API
 * directly, which is the "centralized state" benefit of Redux.
 */

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      return response.data; // { message, token, user }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Used by the thunk's fulfilled handling below, but also exposed
    // directly in case a component ever needs to set auth state
    // synchronously (not used in this project, kept for completeness).
    loginSuccess(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
    },

    // Clears all auth state AND localStorage. This is the only place
    // that should be called to log a user out.
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // Called once on app start (see App.js) to rehydrate Redux state
    // from whatever was saved in localStorage on a previous session,
    // so refreshing the page doesn't log the user out.
    restoreSession(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.loading = false;
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        // Persist to localStorage so a page refresh can restore the
        // session (see restoreSession above and App.js).
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed.';
      });
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
