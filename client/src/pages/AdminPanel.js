import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import './Pages.css';

/**
 * pages/AdminPanel.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Only reachable via <ProtectedRoute allowedRoles={['Admin']}>. Calls
 * GET /api/admin, which on the backend is also independently guarded
 * by authorizeRoles('Admin') - so even if someone bypassed the React
 * route guard, the API itself would still reject them with a 403.
 */
function AdminPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/admin')
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            'Failed to load admin data.'
        )
      );
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Admin Panel</h1>
        {error && <p className="auth-card__error">{error}</p>}
        {data && (
          <>
            <p>{data.message}</p>
            <ul className="panel-data">
              <li>Total Users: {data.data.totalUsers}</li>
              <li>System Status: {data.data.systemStatus}</li>
              <li>{data.data.sensitiveInfo}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
