const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    joinCampaign,
    leaveCampaign,
    getUserCampaigns,
    getParticipationStatus
} = require('../controllers/campaignParticipationController');

// All routes require authentication
router.use(authMiddleware);

// Campaign participation routes
router.post('/:id/join', joinCampaign);
router.delete('/:id/leave', leaveCampaign);
router.get('/my-campaigns', getUserCampaigns);
router.get('/:id/participation-status', getParticipationStatus);

module.exports = router;
