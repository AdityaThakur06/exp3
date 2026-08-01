import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

/**
 * pages/NotFound.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Catch-all route (path="*") for any URL that doesn't match a
 * defined route.
 */
function NotFound() {
  return (
    <div className="page page--centered">
      <div className="card card--narrow">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
