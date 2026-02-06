const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insights.controller');
const authenticate = require('../middleware/auth.middleware');

router.get('/mood-insights', authenticate, insightsController.getMoodInsights);
router.get('/weekly-report', authenticate, insightsController.getWeeklyReport);

module.exports = router;


