const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    submitVideo,
    getUserSubmissions,
    getSubmissionsByCampaign,
    refreshVideoStats,
    getAggregatedStats
} = require('../controllers/videoSubmissionController');

// All routes require authentication
router.use(authMiddleware);

// Video submission routes
router.post('/', submitVideo);
router.get('/', getUserSubmissions);
router.get('/stats', getAggregatedStats);
router.get('/campaign/:campaignId', getSubmissionsByCampaign);
router.post('/:id/refresh-stats', refreshVideoStats);

module.exports = router;
