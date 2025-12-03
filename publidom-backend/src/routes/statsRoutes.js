const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/stats - Get user statistics
router.get('/', authMiddleware, getStats);

module.exports = router;
