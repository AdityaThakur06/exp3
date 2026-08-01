require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');

/**
 * server.js
 * ------------------------------------------------------------------
 * PURPOSE
 * The application entry point. Wires up global middleware (CORS,
 * JSON body parsing), mounts the two route modules under /api, adds
 * a 404 fallback and a centralized error handler, then starts the
 * HTTP server.
 *
 * JWT FLOW (end-to-end, for reference)
 *   1. Client POSTs { email, password } to /api/login.
 *   2. authController.login verifies credentials with bcrypt and,
 *      on success, calls generateToken() to sign a JWT containing
 *      { id, name, email, role }.
 *   3. Client stores the token (localStorage) and attaches it as
 *      `Authorization: Bearer <token>` on every subsequent request
 *      (see the Axios interceptor on the frontend).
 *   4. verifyToken middleware validates the signature + expiry on
 *      each protected request and attaches the decoded payload to
 *      req.user.
 *   5. authorizeRoles middleware (where present) checks req.user.role
 *      against the route's allowed roles before letting the request
 *      reach its controller.
 */
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'JWT Auth + RBAC API is running.' });
});

app.use('/api', authRoutes);
app.use('/api', roleRoutes);

// 404 handler for unmatched API routes.
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Centralized error handler - catches any error passed to next(err)
// or thrown synchronously inside a route handler, so we never leak a
// raw stack trace to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
