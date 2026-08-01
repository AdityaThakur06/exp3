import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Pages.css';

/**
 * pages/Home.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Public landing page - accessible whether or not the user is
 * logged in. Shows a "Go to Dashboard" call-to-action if already
 * authenticated, otherwise a "Login" call-to-action.
 */
function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="page">
      <div className="card">
        <h1>Secure Authentication &amp; RBAC Demo</h1>
        <p>
          This app demonstrates JWT-based authentication and role-based access
          control (RBAC) with three roles: <strong>Admin</strong>,{' '}
          <strong>Editor</strong>, and <strong>Viewer</strong>.
        </p>

        {isAuthenticated ? (
          <p>
            Welcome back, <strong>{user.name}</strong>! You are logged in as{' '}
            <strong>{user.role}</strong>.{' '}
            <Link to="/dashboard">Go to your Dashboard →</Link>
          </p>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to access your role-specific
            dashboard and panels.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
