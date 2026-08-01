const express = require('express');
const { login, getProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

/**
 * routes/authRoutes.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Defines the two authentication-related endpoints:
 *   POST /api/login    - public, issues a JWT
 *   GET  /api/profile  - protected, requires a valid JWT
 *
 * HOW PROTECTED ROUTES WORK
 * `router.get('/profile', verifyToken, getProfile)` chains
 * middleware: Express runs verifyToken first. If it calls next(),
 * getProfile runs next with req.user already populated. If
 * verifyToken instead sends a 401 response, getProfile never runs.
 */
const router = express.Router();

router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
