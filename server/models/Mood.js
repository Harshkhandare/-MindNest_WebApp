const { getPool } = require('../config/db');

class Mood {
  static async create(moodData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { userId, moodLevel, emotion, note, date, tags } = moodData;

    const [result] = await pool.execute(
      `INSERT INTO moods (userId, moodLevel, emotion, note, date) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, moodLevel, emotion || 'neutral', note || null, date || new Date()]
    );

    const moodId = result.insertId;

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        await pool.execute(
          'INSERT INTO mood_tags (moodId, tag) VALUES (?, ?)',
          [moodId, tag]
        );
      }
    }

    return await this.findById(moodId);
  }

  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute('SELECT * FROM moods WHERE id = ?', [id]);
    if (!rows[0]) return null;

    const mood = rows[0];
    
    // Get tags
    const [tags] = await pool.execute(
      'SELECT tag FROM mood_tags WHERE moodId = ?',
      [id]
    );
    mood.tags = tags.map(t => t.tag);

    return mood;
  }

  static async findByUser(userId, options = {}) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT * FROM moods WHERE userId = ?';
    const params = [userId];

    if (options.startDate && options.endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(options.startDate, options.endDate);
    }

    query += ' ORDER BY date DESC';

    if (options.limit) {
      const limitValue = parseInt(options.limit);
      if (!isNaN(limitValue) && limitValue > 0) {
        query += ` LIMIT ${limitValue}`;
      }
    }

    const [rows] = await pool.execute(query, params);
    
    // Get tags for each mood
    for (const mood of rows) {
      const [tags] = await pool.execute(
        'SELECT tag FROM mood_tags WHERE moodId = ?',
        [mood.id]
      );
      mood.tags = tags.map(t => t.tag);
    }

    return rows;
  }

  static async update(id, userId, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { moodLevel, emotion, note, tags } = updateData;
    const updates = [];
    const values = [];

    if (moodLevel !== undefined) {
      updates.push('moodLevel = ?');
      values.push(moodLevel);
    }
    if (emotion !== undefined) {
      updates.push('emotion = ?');
      values.push(emotion);
    }
    if (note !== undefined) {
      updates.push('note = ?');
      values.push(note);
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id, userId);
    await pool.execute(
      `UPDATE moods SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      await pool.execute('DELETE FROM mood_tags WHERE moodId = ?', [id]);
      for (const tag of tags) {
        await pool.execute('INSERT INTO mood_tags (moodId, tag) VALUES (?, ?)', [id, tag]);
      }
    }

    return await this.findById(id);
  }

  static async delete(id, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      'DELETE FROM moods WHERE id = ? AND userId = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }

  static async getStats(userId, startDate, endDate) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT * FROM moods WHERE userId = ?';
    const params = [userId];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    const [moods] = await pool.execute(query, params);

    const stats = {
      total: moods.length,
      average: moods.length > 0
        ? (moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length).toFixed(2)
        : 0,
      emotions: {}
    };

    moods.forEach(mood => {
      stats.emotions[mood.emotion] = (stats.emotions[mood.emotion] || 0) + 1;
    });

    return stats;
  }
}

module.exports = Mood;
