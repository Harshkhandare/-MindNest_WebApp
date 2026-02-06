const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');
const authenticate = require('../middleware/auth.middleware');
const { createMood, updateMood } = require('../validators/mood.validator');

router.post('/', authenticate, createMood, moodController.createMood);
router.get('/', authenticate, moodController.getMoods);
router.get('/stats', authenticate, moodController.getMoodStats);
router.get('/:id', authenticate, moodController.getMoodById);
router.put('/:id', authenticate, updateMood, moodController.updateMood);
router.delete('/:id', authenticate, moodController.deleteMood);

module.exports = router;

