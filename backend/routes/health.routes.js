const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint for monitoring and uptime checks.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
