const { getPool } = require('../config/db');

class Journal {
  static async create(journalData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { userId, title, content, mood, tags } = journalData;

    const [result] = await pool.execute(
      `INSERT INTO journals (userId, title, content, mood) 
       VALUES (?, ?, ?, ?)`,
      [userId, title || null, content, mood || null]
    );

    const journalId = result.insertId;

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await pool.execute(
          'INSERT INTO journal_tags (journalId, tag) VALUES (?, ?)',
          [journalId, tag]
        );
      }
    }

    return await this.findById(journalId);
  }

  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute('SELECT * FROM journals WHERE id = ?', [id]);
    if (!rows[0]) return null;

    // Get tags
    const [tags] = await pool.execute(
      'SELECT tag FROM journal_tags WHERE journalId = ?',
      [id]
    );

    return {
      ...rows[0],
      tags: tags.map(t => t.tag)
    };
  }

  static async findByUser(userId, options = {}) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT * FROM journals WHERE userId = ?';
    const params = [userId];

    if (options.search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC';

    if (options.limit) {
      const limitValue = parseInt(options.limit);
      if (!isNaN(limitValue) && limitValue > 0) {
        query += ` LIMIT ${limitValue}`;
        
        if (options.page) {
          const pageValue = parseInt(options.page);
          if (!isNaN(pageValue) && pageValue > 0) {
            const offset = (pageValue - 1) * limitValue;
            query += ` OFFSET ${offset}`;
          }
        }
      }
    }

    const [journals] = await pool.execute(query, params);

    // Get tags for each journal
    for (const journal of journals) {
      const [tags] = await pool.execute(
        'SELECT tag FROM journal_tags WHERE journalId = ?',
        [journal.id]
      );
      journal.tags = tags.map(t => t.tag);
    }

    return journals;
  }

  static async count(userId, search) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    let query = 'SELECT COUNT(*) as total FROM journals WHERE userId = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async update(id, userId, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { title, content, mood, tags } = updateData;
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (mood !== undefined) {
      updates.push('mood = ?');
      values.push(mood);
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id, userId);
    await pool.execute(
      `UPDATE journals SET ${updates.join(', ')} WHERE id = ? AND userId = ?`,
      values
    );

    // Update tags if provided
    if (tags) {
      await pool.execute('DELETE FROM journal_tags WHERE journalId = ?', [id]);
      for (const tag of tags) {
        await pool.execute('INSERT INTO journal_tags (journalId, tag) VALUES (?, ?)', [id, tag]);
      }
    }

    return await this.findById(id);
  }

  static async delete(id, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      'DELETE FROM journals WHERE id = ? AND userId = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Journal;
