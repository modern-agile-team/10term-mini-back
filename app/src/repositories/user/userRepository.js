"use strict";

const pool = require("../../config/db");

class UserRepository {
  async findByUserId(user_id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
    return rows[0];
  }

  async findByNickname(nickname) {
    const [rows] = await pool.query("SELECT * FROM users WHERE nickname = ?", [nickname]);
    return rows[0];
  }

  async createUser({user_id, password, nickname}) {
    const [result] = await pool.query("INSERT INTO users (user_id, password, nickname) VALUES (?, ?, ?)", [user_id, password, nickname]);
    const user = this.findByUserId(user_id);
    return user;
  }
}

module.exports = UserRepository;