import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Pages.css';

/**
 * pages/Dashboard.js
 * ------------------------------------------------------------------
 * PURPOSE
 * A shared landing page for ANY authenticated user, regardless of
 * role (protected by <ProtectedRoute> with no `allowedRoles`, so it
 * only checks `isAuthenticated`). It surfaces a shortcut link to the
 * user's role-specific panel.
 */
function Dashboard() {
  const { user } = useAuth();

  const roleLinks = {
    Admin: { to: '/admin', label: 'Go to Admin Panel' },
    Editor: { to: '/editor', label: 'Go to Editor Panel' },
    Viewer: { to: '/viewer', label: 'Go to Viewer Panel' },
  };
  const roleLink = roleLinks[user.role];

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>
        <p>
          Hello, <strong>{user.name}</strong>. You're logged in as{' '}
          <strong>{user.role}</strong>.
        </p>
        <div className="card__grid">
          <Link className="card__tile" to="/profile">
            View Profile
          </Link>
          {roleLink && (
            <Link className="card__tile" to={roleLink.to}>
              {roleLink.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
