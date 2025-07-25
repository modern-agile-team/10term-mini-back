"use strict";

const pool = require("../../config/db");

class UserRepository {
  async findByUserId(userId) {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
    return rows[0];
  }

  async findByNickname(nickname) {
    const [rows] = await pool.query("SELECT * FROM users WHERE nickname = ?", [nickname]);
    return rows[0];
  }

  async createUser({userId, password, nickname}) {
    const [result] = await pool.query("INSERT INTO users (user_id, password, nickname) VALUES (?, ?, ?)", [userId, password, nickname]);
    const user = await this.findByUserId(userId);
    return user;
  }
}

module.exports = UserRepository;