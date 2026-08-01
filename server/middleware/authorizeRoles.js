/**
 * middleware/authorizeRoles.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Implements Role-Based Access Control (RBAC). This is a "middleware
 * factory" - a function that RETURNS a middleware, which lets us
 * parameterize it per-route: authorizeRoles('Admin'),
 * authorizeRoles('Editor', 'Admin'), etc.
 *
 * HOW RBAC WORKS HERE
 * verifyToken must run first so req.user.role is already populated
 * from the trusted JWT payload (never from a client-supplied body/
 * query param, which could be tampered with). authorizeRoles then
 * simply checks whether req.user.role is included in the list of
 * roles allowed for this route. If not, it responds 403 Forbidden
 * (the user IS authenticated - we know who they are - they just
 * don't have permission for this specific resource, which is the
 * correct distinction between 401 Unauthorized and 403 Forbidden).
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // Should never happen if verifyToken runs first, but guards
      // against misconfigured route chains.
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
}

module.exports = authorizeRoles;
