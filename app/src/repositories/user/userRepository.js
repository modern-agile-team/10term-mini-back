"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class UserRepository {
  async findByUsername(username) {
    const query = `
      SELECT * 
      FROM users 
      WHERE username = ?;
    `;
    const [rows] = await pool.query(query, [username]);
    return toCamelCase(rows[0]);
  }

  async findByNickname(nickname) {
    const query = `
      SELECT * 
      FROM users 
      WHERE nickname = ?;
    `;
    const [rows] = await pool.query(query, [nickname]);
    return toCamelCase(rows[0]);
  }

  async createUser({ username, password, nickname }) {
    const query = `
      INSERT INTO users (username, password, nickname) 
      VALUES (?, ?, ?);
    `;
    const [result] = await pool.query(query, [username, password, nickname]);

    const user = await this.findByUsername(username);
    return user;
  }
}

module.exports = UserRepository;
