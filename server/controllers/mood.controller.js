const Mood = require('../models/Mood');
const { getPool } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createMood = async (req, res) => {
  try {
    // Validation
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

    const { moodLevel, emotion, note, tags } = req.body;

    // Additional validation
    if (!moodLevel || moodLevel < 1 || moodLevel > 10) {
      return res.status(400).json({ message: 'Mood level must be between 1 and 10' });
    }

    const mood = await Mood.create({
      userId: req.user.id,
      moodLevel: parseInt(moodLevel),
      emotion: emotion || 'neutral',
      note: note || null,
      tags: tags || [],
      date: new Date()
    });

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Get updated stats for dashboard
      const stats = await Mood.getStats(req.user.id, null, null);
      io.to(`user:${req.user.id}`).emit('mood:created', {
        mood,
        stats
      });
    }

    res.status(201).json({ message: 'Mood saved successfully', mood });
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: error.message || 'Failed to save mood' });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { startDate, endDate, limit = 30 } = req.query;

    const moods = await Mood.findByUser(req.user.id, {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      limit: parseInt(limit)
    });

    res.json({ moods });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMoodById = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const mood = await Mood.findById(req.params.id);

    if (!mood || mood.userId !== req.user.id) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    res.json({ mood });
  } catch (error) {
    console.error('Get mood error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateMood = async (req, res) => {
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

    const { moodLevel, emotion, note, tags } = req.body;

    const mood = await Mood.update(req.params.id, req.user.id, {
      moodLevel,
      emotion,
      note,
      tags
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const stats = await Mood.getStats(req.user.id, null, null);
      io.to(`user:${req.user.id}`).emit('mood:updated', {
        mood,
        stats
      });
    }

    res.json({ message: 'Mood updated successfully', mood });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMood = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const deleted = await Mood.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const stats = await Mood.getStats(req.user.id, null, null);
      io.to(`user:${req.user.id}`).emit('mood:deleted', {
        moodId: req.params.id,
        stats
      });
    }

    res.json({ message: 'Mood deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMoodStats = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { startDate, endDate } = req.query;

    const stats = await Mood.getStats(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );

    res.json({ stats });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
