const cron = require('node-cron');
const { getPool } = require('../config/db');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

class ReminderScheduler {
  constructor() {
    this.io = null;
    this.jobs = new Map();
  }

  start(io) {
    this.io = io;
    console.log('⏰ Reminder scheduler started');
    
    // Check for reminders every minute
    cron.schedule('* * * * *', async () => {
      await this.checkReminders();
    });
  }

  async checkReminders() {
    try {
      const pool = getPool();
      if (!pool) return;

      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
      const currentDay = now.getDay();

      // Get active reminders for current time and day
      const [reminders] = await pool.execute(`
        SELECT r.*, u.notifications as userNotifications
        FROM reminders r
        INNER JOIN users u ON r.userId = u.id
        WHERE r.isActive = TRUE
        AND TIME(r.time) = ?
        AND EXISTS (
          SELECT 1 FROM reminder_days rd
          WHERE rd.reminderId = r.id
          AND rd.day = ?
        )
        AND (r.lastTriggered IS NULL OR DATE(r.lastTriggered) != DATE(?))
      `, [currentTime, currentDay, now]);

      for (const reminder of reminders) {
        await this.triggerReminder(reminder);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  async triggerReminder(reminder) {
    try {
      const pool = getPool();
      if (!pool) return;

      // Update last triggered
      await pool.execute(
        'UPDATE reminders SET lastTriggered = ? WHERE id = ?',
        [new Date(), reminder.id]
      );

      // Send Socket.IO notification
      if (this.io) {
        this.io.to(`user:${reminder.userId}`).emit('reminder:triggered', {
          id: reminder.id,
          title: reminder.title,
          description: reminder.description,
          type: reminder.type,
          time: reminder.time
        });
      }

      // If user has notifications enabled, we could also send email here
      if (reminder.userNotifications) {
        // Email notification would go here
        console.log(`📧 Reminder notification for user ${reminder.userId}: ${reminder.title}`);
      }

      console.log(`⏰ Reminder triggered: ${reminder.title} for user ${reminder.userId}`);
    } catch (error) {
      console.error('Error triggering reminder:', error);
    }
  }
}

module.exports = new ReminderScheduler();
