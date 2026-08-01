const bcrypt = require('bcryptjs');
const users = require('../data/users');
const generateToken = require('../utils/generateToken');

/**
 * controllers/authController.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Houses the business logic for authentication endpoints, kept
 * separate from route definitions (routes/authRoutes.js) so routing
 * concerns (URLs, middleware chains) and business logic don't mix.
 */

/**
 * POST /api/login
 * Validates email/password against the mock user store, and on
 * success returns a signed JWT plus the public user profile
 * (password is NEVER sent back to the client).
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Deliberately use the same generic error message whether the
    // email doesn't exist or the password is wrong - this prevents
    // "user enumeration" (an attacker probing which emails exist).
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

/**
 * GET /api/profile
 * Protected by verifyToken. req.user was populated by the middleware
 * from the JWT payload, so we can look up the fresh user record (in
 * case name/role changed since the token was issued) or just echo
 * back the token's claims. Here we re-fetch from the mock store to
 * demonstrate how you'd do it against a real database.
 */
function getProfile(req, res) {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

module.exports = { login, getProfile };
