"use strict";

const getDb = require("@utils/getDb");
const toCamelCase = require("@utils/toCamelCase");

class UserRepository {
  async findById(userId, conn) {
    const db = getDb(conn);
    const query = `
      SELECT *
      FROM users
      WHERE id = ?;
    `;
    const [rows] = await db.query(query, [userId]);
    return rows.length ? toCamelCase(rows[0]) : null;
  }

  async findByUsername(username, conn) {
    const db = getDb(conn);
    const query = `
      SELECT * 
      FROM users 
      WHERE username = ?;
    `;
    const [rows] = await db.query(query, [username]);
    return rows[0];
  }

  async findByNickname(nickname, conn) {
    const db = getDb(conn);
    const query = `
      SELECT * 
      FROM users 
      WHERE nickname = ?;
    `;
    const [rows] = await db.query(query, [nickname]);
    return rows[0];
  }

  async createUser({ username, password, nickname }, conn) {
    const db = getDb(conn);
    const query = `
      INSERT INTO users (username, password, nickname) 
      VALUES (?, ?, ?);
    `;
    const [result] = await db.query(query, [username, password, nickname]);

    const userId = result.insertId;
    return await this.findById(userId);
  }

  async updateNickname(userId, newNickname, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE users
      SET nickname = ?
      WHERE id = ?;
    `;
    const [result] = await db.query(query, [newNickname, userId]);
    return result.affectedRows === 1;
  }

  async updatePassword(userId, hashedPassword, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE users
      SET password = ?
      WHERE id = ?;
    `;
    const [result] = await db.query(query, [hashedPassword, userId]);
    return result.affectedRows === 1;
  }
}

module.exports = UserRepository;
