const jwt = require('jsonwebtoken');

/**
 * middleware/verifyToken.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Protects any route it's attached to. It:
 *   1. Reads the `Authorization: Bearer <token>` header.
 *   2. Verifies the token's signature and expiry using JWT_SECRET.
 *   3. On success, attaches the decoded payload to `req.user` so
 *      downstream route handlers (and authorizeRoles, below) can
 *      read `req.user.id` / `req.user.role` etc. without re-parsing
 *      the token.
 *   4. On failure, immediately responds with 401 and stops the
 *      request from reaching the route handler.
 *
 * HOW MIDDLEWARE WORKS
 * Express middleware functions run in the order they're registered.
 * A middleware either calls `next()` to pass control to the next
 * function in the chain, or ends the response itself (e.g. res.json)
 * to short-circuit the chain. By putting verifyToken BEFORE a route
 * handler (verifyToken, handler) or before authorizeRoles
 * (verifyToken, authorizeRoles('Admin'), handler), we guarantee the
 * handler only ever runs for requests with a valid, non-expired
 * token.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
}

module.exports = verifyToken;
