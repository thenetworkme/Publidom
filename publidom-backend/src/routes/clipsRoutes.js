const express = require('express');
const router = express.Router();
const { getClips, createClip, updateClip, deleteClip } = require('../controllers/clipsController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/clips - Get user's clips
router.get('/', authMiddleware, getClips);

// POST /api/clips - Create new clip
router.post('/', authMiddleware, createClip);

// PUT /api/clips/:id - Update clip
router.put('/:id', authMiddleware, updateClip);

// DELETE /api/clips/:id - Delete clip
router.delete('/:id', authMiddleware, deleteClip);

module.exports = router;
