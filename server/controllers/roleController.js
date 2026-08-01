/**
 * controllers/roleController.js
 * ------------------------------------------------------------------
 * PURPOSE
 * Simple handlers for each role-specific endpoint. In a real app
 * these would contain actual business logic (querying a database
 * scoped to the user's permissions, etc.) - here they just return
 * a message + req.user so the frontend has something concrete to
 * render and you can see exactly what the token contained.
 */

function getAdminData(req, res) {
  res.status(200).json({
    message: `Welcome Admin ${req.user.name}. This data is restricted to Admins only.`,
    data: {
      totalUsers: 3,
      systemStatus: 'All systems operational',
      sensitiveInfo: 'Only Admins can see this payload.',
    },
    requestedBy: req.user,
  });
}

function getEditorData(req, res) {
  res.status(200).json({
    message: `Welcome Editor ${req.user.name}. This data is restricted to Editors only.`,
    data: {
      draftArticles: 5,
      publishedArticles: 12,
    },
    requestedBy: req.user,
  });
}

function getViewerData(req, res) {
  res.status(200).json({
    message: `Welcome Viewer ${req.user.name}. This data is restricted to Viewers only.`,
    data: {
      publicArticles: 12,
      readOnly: true,
    },
    requestedBy: req.user,
  });
}

module.exports = { getAdminData, getEditorData, getViewerData };
