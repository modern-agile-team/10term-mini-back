"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");
const { param } = require("../../routes/home");

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

  async findFavoritesByUserId(userId, sort) {
    const allowedSorts = {
      recent: "ws.created_at DESC",
      updated: "w.updated_at DESC",
    };

    const orderBy = allowedSorts[sort] || allowedSorts.updated;

    const query = `
      SELECT
        ws.webtoon_id,
        w.title,
        w.writer,
        w.thumbnail_url,
        w.updated_at,
        ws.created_at
      FROM webtoon_favorites ws
      JOIN webtoons w ON ws.webtoon_id = w.id
      WHERE ws.user_id = ?
      ORDER BY ${orderBy};
    `;

    const [rows] = await pool.query(query, [userId]);
    return toCamelCase(rows);
  }

  async deleteFavorites(userId, webtoonIds) {
    if (!Array.isArray(webtoonIds) || webtoonIds.length === 0) {
      return 0;
    }

    const placeholders = webtoonIds.map(() => "?").join(",");

    const query = `
    DELETE FROM webtoon_favorites
    WHERE user_id = ? AND webtoon_id IN (${placeholders});
  `;
    const params = [userId, ...webtoonIds];
    const [result] = await pool.query(query, params);
    const deletedCount = result.affectedRows || 0;
    return deletedCount;
  }
}

module.exports = UserRepository;
