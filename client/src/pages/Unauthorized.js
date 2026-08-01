import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

/**
 * pages/Unauthorized.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Shown when ProtectedRoute determines the user IS authenticated but
 * does NOT have a permitted role for the page they tried to visit
 * (e.g. a Viewer navigating directly to /admin).
 */
function Unauthorized() {
  return (
    <div className="page page--centered">
      <div className="card card--narrow">
        <h1>403 - Unauthorized</h1>
        <p>You don't have permission to view this page.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default Unauthorized;
