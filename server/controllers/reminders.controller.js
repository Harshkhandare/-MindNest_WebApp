const Reminder = require('../models/Reminder');
const { getPool } = require('../config/db');

exports.createReminder = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { type, title, description, time, days } = req.body;

    if (!type || !title || !time) {
      return res.status(400).json({ message: 'Type, title, and time are required' });
    }

    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: 'At least one day must be selected' });
    }

    const reminder = await Reminder.create({
      userId: req.user.id,
      type,
      title: title.trim(),
      description: description || null,
      time,
      days: days || []
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('reminder:created', { reminder });
    }

    res.status(201).json({ message: 'Reminder created successfully', reminder });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { isActive } = req.query;

    const reminders = await Reminder.findByUser(req.user.id, {
      isActive: isActive !== undefined ? isActive === 'true' : undefined
    });

    res.json({ reminders });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReminderById = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const reminder = await Reminder.findById(req.params.id);

    if (!reminder || reminder.userId !== req.user.id) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ reminder });
  } catch (error) {
    console.error('Get reminder error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { type, title, description, time, days, isActive } = req.body;

    const updateData = {};
    if (type) updateData.type = type;
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (time) updateData.time = time;
    if (days) updateData.days = days;
    if (isActive !== undefined) updateData.isActive = isActive;

    const reminder = await Reminder.update(req.params.id, req.user.id, updateData);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('reminder:updated', { reminder });
    }

    res.json({ message: 'Reminder updated successfully', reminder });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const deleted = await Reminder.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${req.user.id}`).emit('reminder:deleted', { reminderId: req.params.id });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: error.message });
  }
};
