const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findOne(conditions) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { email, username, id } = conditions;
    let query = 'SELECT * FROM users WHERE ';
    let params = [];

    if (id) {
      query += 'id = ?';
      params.push(id);
    } else if (email) {
      query += 'email = ?';
      params.push(email.toLowerCase());
    } else if (username) {
      query += 'username = ?';
      params.push(username);
    } else {
      return null;
    }

    const [rows] = await pool.execute(query, params);
    return rows[0] || null;
  }

  static async findByEmailOrUsername(email, username) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email.toLowerCase(), username]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    return await this.findOne({ id });
  }

  static async create(userData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { username, email, password, firstName, lastName, dateOfBirth } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password, firstName, lastName, dateOfBirth) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email.toLowerCase(), hashedPassword, firstName || null, lastName || null, dateOfBirth || null]
    );

    return await this.findById(result.insertId);
  }

  static async update(id, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const allowedFields = ['lastLogin', 'theme', 'highContrast', 'textToSpeech', 'notifications', 
                          'firstName', 'lastName', 'dateOfBirth', 'profilePicture'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return await this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  static async comparePassword(hashedPassword, candidatePassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
