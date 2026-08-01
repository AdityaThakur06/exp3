import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { loginUser } from '../redux/authSlice';
import './Pages.css';

/**
 * pages/Login.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Collects email/password and dispatches the `loginUser` async
 * thunk. On success, `isAuthenticated` flips to true in Redux, which
 * this component watches via useEffect to redirect to the page the
 * user originally tried to visit (or /dashboard by default).
 *
 * JWT FLOW FROM THE FRONTEND'S PERSPECTIVE
 *   1. User submits the form -> dispatch(loginUser({ email, password })).
 *   2. The thunk POSTs to /api/login via our axios instance.
 *   3. On success, authSlice's extraReducers store { token, user } in
 *      both Redux state AND localStorage.
 *   4. From this point on, axiosInstance's request interceptor
 *      attaches `Authorization: Bearer <token>` automatically to
 *      every future request - Login.js never has to think about the
 *      token again.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="page page--centered">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-card__error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-card__hint">
          <p>Demo accounts:</p>
          <ul>
            <li>admin@example.com / admin123 (Admin)</li>
            <li>editor@example.com / editor123 (Editor)</li>
            <li>viewer@example.com / viewer123 (Viewer)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
