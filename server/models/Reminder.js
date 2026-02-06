const { getPool } = require('../config/db');

class Reminder {
  static async create(reminderData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { userId, type, title, description, time, days } = reminderData;

    const [result] = await pool.execute(
      `INSERT INTO reminders (userId, type, title, description, time) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, description || null, time]
    );

    const reminderId = result.insertId;

    // Add days if provided
    if (days && Array.isArray(days) && days.length > 0) {
      for (const day of days) {
        await pool.execute(
          'INSERT INTO reminder_days (reminderId, day) VALUES (?, ?)',
          [reminderId, day]
        );
      }
    }

    return await this.findById(reminderId);
  }

  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute('SELECT * FROM reminders WHERE id = ?', [id]);
    if (!rows[0]) return null;

    const reminder = rows[0];

    // Get days
    const [days] = await pool.execute(
      'SELECT day FROM reminder_days WHERE reminderId = ?',
      [id]
    );
    reminder.days = days.map(d => d.day);

    return reminder;
  }

  static async findByUser(userId, options = {}) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT * FROM reminders WHERE userId = ?';
    const params = [userId];

    if (options.isActive !== undefined) {
      query += ' AND isActive = ?';
      params.push(options.isActive);
    }

    query += ' ORDER BY createdAt DESC';

    const [reminders] = await pool.execute(query, params);

    // Get days for each reminder
    for (const reminder of reminders) {
      const [days] = await pool.execute(
        'SELECT day FROM reminder_days WHERE reminderId = ?',
        [reminder.id]
      );
      reminder.days = days.map(d => d.day);
    }

    return reminders;
  }

  static async update(id, userId, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const allowedFields = ['type', 'title', 'description', 'time', 'isActive', 'lastTriggered'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id, userId);
    await pool.execute(
      `UPDATE reminders SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );

    // Update days if provided
    if (updateData.days && Array.isArray(updateData.days)) {
      await pool.execute('DELETE FROM reminder_days WHERE reminderId = ?', [id]);
      for (const day of updateData.days) {
        await pool.execute('INSERT INTO reminder_days (reminderId, day) VALUES (?, ?)', [id, day]);
      }
    }

    return await this.findById(id);
  }

  static async delete(id, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      'DELETE FROM reminders WHERE id = ? AND userId = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Reminder;
