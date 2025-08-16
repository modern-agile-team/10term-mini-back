"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class UserRepository {
  async findById(userId) {
    const query = `
      SELECT *
      FROM users
      WHERE id = ?;
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows.length ? toCamelCase(rows[0]) : null;
  }

  async findByUsername(username) {
    const query = `
      SELECT * 
      FROM users 
      WHERE username = ?;
    `;
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  }

  async findByNickname(nickname) {
    const query = `
      SELECT * 
      FROM users 
      WHERE nickname = ?;
    `;
    const [rows] = await pool.query(query, [nickname]);
    return rows[0];
  }

  async createUser({ username, password, nickname }) {
    const query = `
      INSERT INTO users (username, password, nickname) 
      VALUES (?, ?, ?);
    `;
    const [result] = await pool.query(query, [username, password, nickname]);

    const userId = result.insertId;
    return await this.findById(userId);
  }

  async updateNickname(userId, newNickname) {
    const query = `
      UPDATE users
      SET nickname = ?
      WHERE id = ?;
    `;
    const [result] = await pool.query(query, [newNickname, userId]);
    return result.affectedRows === 1;
  }

  async updatePassword(userId, hashedPassword) {
    const query = `
      UPDATE users
      SET password = ?
      WHERE id = ?;
    `;
    const [result] = await pool.query(query, [hashedPassword, userId]);
    return result.affectedRows === 1;
  }
}

module.exports = UserRepository;
