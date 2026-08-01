import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import { restoreSession, logout } from './redux/authSlice';
import { isTokenExpired } from './utils/tokenUtils';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import EditorPanel from './pages/EditorPanel';
import ViewerPanel from './pages/ViewerPanel';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

import './App.css';

/**
 * App.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Root component. Two jobs beyond rendering routes:
 *
 * 1) SESSION RESTORATION ON REFRESH
 *    On mount, we check localStorage for a saved token/user. If
 *    present AND not expired (checked client-side via
 *    isTokenExpired), we dispatch `restoreSession` so Redux state is
 *    rehydrated exactly as it was before the refresh - this is what
 *    makes "stay logged in after refresh" work, since Redux state
 *    itself is always wiped on a full page reload.
 *    If the saved token IS expired, we proactively dispatch `logout`
 *    to clear stale data and let the user see the Login page instead
 *    of a broken authenticated-looking UI that would immediately 401
 *    on the first API call.
 *
 * 2) ROUTE DEFINITIONS
 *    - Public: /, /login, /unauthorized, *
 *    - Authenticated only: /dashboard, /profile
 *    - Role-restricted: /admin (Admin), /editor (Editor), /viewer
 *      (Viewer) - each wrapped in <ProtectedRoute allowedRoles={...}>
 *
 * We gate rendering with a `checkedSession` flag so protected routes
 * don't flash a redirect to /login before the localStorage check has
 * even run.
 */
function App() {
  const dispatch = useDispatch();
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      if (isTokenExpired(token)) {
        dispatch(logout());
      } else {
        dispatch(restoreSession({ token, user: JSON.parse(userJson) }));
      }
    }
    setCheckedSession(true);
  }, [dispatch]);

  if (!checkedSession) {
    return null; // brief blank screen while we check localStorage
  }

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute allowedRoles={['Editor']}>
              <EditorPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewer"
          element={
            <ProtectedRoute allowedRoles={['Viewer']}>
              <ViewerPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
