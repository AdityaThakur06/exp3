import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { logout } from '../../redux/authSlice';
import './Navbar.css';

/**
 * components/Navbar/Navbar.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Top navigation bar. Reads `isAuthenticated` and `user.role` from
 * Redux to decide which links to show:
 *   - Logged out: only "Login".
 *   - Logged in:  "Dashboard", "Profile", "Logout", plus a role
 *     panel link ("Admin Panel"/"Editor Panel"/"Viewer Panel") ONLY
 *     for the matching role - this is RBAC applied at the UI level,
 *     hiding links the user isn't allowed to use (the backend still
 *     enforces this independently if someone types the URL directly).
 */
function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        SecureApp
      </Link>

      <div className="navbar__links">
        <Link to="/">Home</Link>

        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && <Link to="/profile">Profile</Link>}

        {isAuthenticated && user?.role === 'Admin' && (
          <Link to="/admin">Admin Panel</Link>
        )}
        {isAuthenticated && user?.role === 'Editor' && (
          <Link to="/editor">Editor Panel</Link>
        )}
        {isAuthenticated && user?.role === 'Viewer' && (
          <Link to="/viewer">Viewer Panel</Link>
        )}

        {!isAuthenticated && <Link to="/login">Login</Link>}
        {isAuthenticated && (
          <button className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {isAuthenticated && (
        <div className="navbar__user">
          {user.name} <span className="navbar__role">({user.role})</span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
