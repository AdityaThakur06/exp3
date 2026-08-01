import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import useAuth from '../hooks/useAuth';
import './Pages.css';

/**
 * pages/Profile.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Displays the logged-in user's info (name/email/role). Rather than
 * just reading from Redux (which already has this data from login),
 * this page also calls the protected GET /api/profile endpoint to
 * demonstrate the full round trip: axiosInstance automatically
 * attaches the JWT, the backend's verifyToken middleware validates
 * it, and authController.getProfile returns the record it found
 * using the token's `id` claim.
 */
function Profile() {
  const { user: reduxUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axiosInstance
      .get('/profile')
      .then((res) => {
        if (isMounted) setProfile(res.data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            (err.response && err.response.data && err.response.data.message) ||
              'Failed to load profile.'
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayUser = profile || reduxUser;

  return (
    <div className="page">
      <div className="card">
        <h1>Profile</h1>
        {loading && <p>Loading profile...</p>}
        {error && <p className="auth-card__error">{error}</p>}
        {displayUser && !loading && (
          <table className="profile-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{displayUser.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{displayUser.email}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{displayUser.role}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;
