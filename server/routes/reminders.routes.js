const express = require('express');
const router = express.Router();
const remindersController = require('../controllers/reminders.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, remindersController.createReminder);
router.get('/', authenticate, remindersController.getReminders);
router.get('/:id', authenticate, remindersController.getReminderById);
router.put('/:id', authenticate, remindersController.updateReminder);
router.delete('/:id', authenticate, remindersController.deleteReminder);

module.exports = router;

