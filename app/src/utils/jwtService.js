"use strict";

const jwt = require("jsonwebtoken");

class JwtService {
  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access_secret_key";
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key";
    this.accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtService;
