import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import './Pages.css';

/**
 * pages/EditorPanel.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Only reachable via <ProtectedRoute allowedRoles={['Editor']}>. Calls
 * GET /api/editor, backed by authorizeRoles('Editor') on the server.
 */
function EditorPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/editor')
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(
          (err.response && err.response.data && err.response.data.message) ||
            'Failed to load editor data.'
        )
      );
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Editor Panel</h1>
        {error && <p className="auth-card__error">{error}</p>}
        {data && (
          <>
            <p>{data.message}</p>
            <ul className="panel-data">
              <li>Draft Articles: {data.data.draftArticles}</li>
              <li>Published Articles: {data.data.publishedArticles}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default EditorPanel;
