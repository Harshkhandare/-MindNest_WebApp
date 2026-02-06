const { getPool } = require('../config/db');

class Goal {
  static async create(goalData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { userId, title, description, type, targetDate } = goalData;

    const [result] = await pool.execute(
      `INSERT INTO goals (userId, title, description, type, targetDate) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, description || null, type || 'daily', targetDate || null]
    );

    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute('SELECT * FROM goals WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByUser(userId, options = {}) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT * FROM goals WHERE userId = ?';
    const params = [userId];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async update(id, userId, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const allowedFields = ['title', 'description', 'type', 'status', 'progress', 'targetDate', 'completedAt'];
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
      `UPDATE goals SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );

    return await this.findById(id);
  }

  static async delete(id, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      'DELETE FROM goals WHERE id = ? AND userId = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Goal;
