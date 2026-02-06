const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');
const authenticate = require('../middleware/auth.middleware');
const { createJournal, updateJournal } = require('../validators/journal.validator');

router.post('/', authenticate, createJournal, journalController.createJournal);
router.post('/autosave', authenticate, journalController.autoSave);
router.get('/', authenticate, journalController.getJournals);
router.get('/:id', authenticate, journalController.getJournalById);
router.put('/:id', authenticate, updateJournal, journalController.updateJournal);
router.delete('/:id', authenticate, journalController.deleteJournal);

module.exports = router;

