const Goal = require('../models/Goal');
const { getPool } = require('../config/db');

exports.createGoal = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { title, description, type, targetDate } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Goal title is required' });
    }

    const goal = await Goal.create({
      userId: req.user.id,
      title: title.trim(),
      description: description || null,
      type: type || 'daily',
      targetDate: targetDate ? new Date(targetDate) : null
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('goal:changed', { goal });
    }

    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { status } = req.query;

    const goals = await Goal.findByUser(req.user.id, { status });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.userId !== req.user.id) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { title, description, type, status, progress, targetDate } = req.body;

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date();
        updateData.progress = 100;
      }
    }
    if (progress !== undefined) {
      updateData.progress = Math.min(100, Math.max(0, progress));
      if (updateData.progress === 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
      }
    }
    if (targetDate) updateData.targetDate = new Date(targetDate);

    const goal = await Goal.update(req.params.id, req.user.id, updateData);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('goal:changed', { goal });
    }

    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const deleted = await Goal.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('goal:changed', { goalId: req.params.id, deleted: true });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: error.message });
  }
};
