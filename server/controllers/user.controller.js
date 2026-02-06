const User = require('../models/User');
const { getPool } = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { firstName, lastName, dateOfBirth, profilePicture } = req.body;

    const user = await User.update(req.user.id, {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      profilePicture
    });

    const { password, ...userWithoutPassword } = user;
    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { theme, highContrast, textToSpeech, notifications } = req.body;

    const user = await User.update(req.user.id, {
      theme,
      highContrast,
      textToSpeech,
      notifications
    });

    res.json({
      message: 'Preferences updated successfully',
      preferences: {
        theme: user.theme,
        highContrast: user.highContrast,
        textToSpeech: user.textToSpeech,
        notifications: user.notifications
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: error.message });
  }
};
