const express = require('express');
const router = express.Router();
const { generateSummary, askQuestion } = require('../controllers/ai.controller');
const protect = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// AI-specific rate limit — generous but prevents abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 10,               // 10 AI requests per minute per IP
  message: { success: false, message: 'Too many AI requests, please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(protect);
router.use(aiLimiter);

router.post('/summary', generateSummary);
router.post('/ask', askQuestion);

module.exports = router;
