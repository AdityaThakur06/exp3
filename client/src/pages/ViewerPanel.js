import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import './Pages.css';

/**
 * pages/ViewerPanel.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Only reachable via <ProtectedRoute allowedRoles={['Viewer']}>. Calls
 * GET /api/viewer, backed by authorizeRoles('Viewer') on the server.
 */
function ViewerPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/viewer')
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            'Failed to load viewer data.'
        )
      );
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Viewer Panel</h1>
        {error && <p className="auth-card__error">{error}</p>}
        {data && (
          <>
            <p>{data.message}</p>
            <ul className="panel-data">
              <li>Public Articles: {data.data.publicArticles}</li>
              <li>Read Only: {String(data.data.readOnly)}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewerPanel;
