"use strict";

const pool = require("@config/db");

class UserRepository {
  async findByUsername(username) {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM users 
      WHERE username = ?;
      `,
      [username]
    );
    return rows[0];
  }

  async findByNickname(nickname) {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM users 
      WHERE nickname = ?;
      `,
      [nickname]
    );
    return rows[0];
  }

  async createUser({ username, password, nickname }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (username, password, nickname) 
      VALUES (?, ?, ?);
      `,
      [username, password, nickname]
    );
    const user = await this.findByUsername(username);
    return user;
  }
}

module.exports = UserRepository;
