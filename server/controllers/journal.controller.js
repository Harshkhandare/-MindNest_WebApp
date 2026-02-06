const Journal = require('../models/Journal');
const { getPool } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createJournal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { title, content, mood, tags } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Journal content is required' });
    }

    const journal = await Journal.create({
      userId: req.user.id,
      title: title || null,
      content: content.trim(),
      mood: mood || null,
      tags: tags || []
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('journal:created', { journal });
    }

    res.status(201).json({ message: 'Journal entry created successfully', journal });
  } catch (error) {
    console.error('Create journal error:', error);
    res.status(500).json({ message: error.message || 'Failed to create journal entry' });
  }
};

// Auto-save endpoint for draft journal entries
exports.autoSave = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { title, content, mood, tags, draftId } = req.body;

    let journal;
    if (draftId) {
      // Update existing draft
      journal = await Journal.update(draftId, req.user.id, {
        title,
        content,
        mood,
        tags
      });
    } else {
      // Create new draft
      journal = await Journal.create({
        userId: req.user.id,
        title: title || null,
        content: content || '',
        mood: mood || null,
        tags: tags || []
      });
    }

    res.json({ 
      message: 'Draft saved',
      journal,
      draftId: journal.id
    });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({ message: error.message || 'Failed to save draft' });
  }
};

exports.getJournals = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { page = 1, limit = 10, search } = req.query;

    const journals = await Journal.findByUser(req.user.id, {
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    const total = await Journal.count(req.user.id, search);

    res.json({
      journals,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get journals error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getJournalById = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const journal = await Journal.findById(req.params.id);

    if (!journal || journal.userId !== req.user.id) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ journal });
  } catch (error) {
    console.error('Get journal error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateJournal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { title, content, mood, tags } = req.body;

    const journal = await Journal.update(req.params.id, req.user.id, {
      title,
      content,
      mood,
      tags
    });

    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('journal:updated', { journal });
    }

    res.json({ message: 'Journal entry updated successfully', journal });
  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJournal = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const deleted = await Journal.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('journal:deleted', { journalId: req.params.id });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal error:', error);
    res.status(500).json({ message: error.message });
  }
};
