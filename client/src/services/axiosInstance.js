import axios from 'axios';

/**
 * services/axiosInstance.js
 * ------------------------------------------------------------------
 * PURPOSE
 * A single, pre-configured Axios instance used everywhere in the app
 * instead of the bare `axios` import. Centralizing it here means:
 *   - baseURL is set once (from REACT_APP_API_URL).
 *   - A REQUEST interceptor automatically attaches
 *     `Authorization: Bearer <token>` to every outgoing request that
 *     has a token in localStorage - callers never have to remember
 *     to add the header manually.
 *   - A RESPONSE interceptor watches for 401 responses (meaning the
 *     server rejected/expired the token) and reacts globally: clears
 *     localStorage and redirects to /login, instead of every
 *     component having to handle that case individually.
 *
 * Note: this module intentionally does NOT import the Redux store to
 * dispatch `logout()` directly, which would create a circular import
 * risk (store -> authSlice -> axiosInstance -> store). Instead it
 * clears localStorage and does a hard redirect; App.js's session
 * restoration logic on load will see there's no valid token and
 * render as logged out.
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loops if we're already on the login page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
