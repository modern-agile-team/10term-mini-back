"use strict";

const pool = require("../../config/db");

class UserRepository {
  async findByUserName(userName) {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM users 
      WHERE username = ?;
      `,
      [userName]
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

  async createUser({ userName, password, nickname }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (username, password, nickname) 
      VALUES (?, ?, ?);
      `,
      [userName, password, nickname]
    );
    const user = await this.findByUserName(userName);
    return user;
  }
}

module.exports = UserRepository;
