import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * routes/ProtectedRoute.js
 * ------------------------------------------------------------------
 * HOW PROTECTED ROUTES WORK ON THE FRONTEND
 * This is a wrapper component used like:
 *   <Route path="/admin" element={
 *     <ProtectedRoute allowedRoles={['Admin']}>
 *       <AdminPanel />
 *     </ProtectedRoute>
 *   } />
 *
 * It reads auth state from Redux (via useAuth) and makes one of
 * three decisions:
 *   1. Not authenticated at all           -> redirect to /login
 *   2. Authenticated but wrong role       -> redirect to /unauthorized
 *   3. Authenticated and role permitted   -> render the children
 *
 * NOTE: this is a UX/navigation guard only. The REAL security
 * boundary is the backend's verifyToken + authorizeRoles middleware -
 * a determined user could bypass this component's checks in devtools,
 * but they still could not get real protected data from the API
 * without a valid token carrying the right role, because the server
 * independently re-checks everything.
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
