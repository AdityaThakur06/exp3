const express = require('express');
const { getAdminData, getEditorData, getViewerData } = require('../controllers/roleController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

/**
 * routes/roleRoutes.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Defines the three role-restricted endpoints. Each route chains
 * TWO middlewares before the handler:
 *   1. verifyToken            - must be logged in at all
 *   2. authorizeRoles('X')    - must have role X specifically
 *
 * This two-step chain cleanly separates AUTHENTICATION ("who are
 * you?") from AUTHORIZATION ("are you allowed to do this?"), which
 * is the core idea behind RBAC.
 */
const router = express.Router();

router.get('/admin', verifyToken, authorizeRoles('Admin'), getAdminData);
router.get('/editor', verifyToken, authorizeRoles('Editor'), getEditorData);
router.get('/viewer', verifyToken, authorizeRoles('Viewer'), getViewerData);

module.exports = router;
