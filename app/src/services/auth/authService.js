"use strict";

const UserRepository = require("@repositories/user/userRepository");
const CustomError = require("@utils/customError");
const JwtService = require("@utils/jwtService");
const bcrypt = require("bcrypt");

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtService = new JwtService();
  }

  async signUp(username, password, nickname) {
    const conflictFields = [];

    const existsUsername = await this.userRepository.findByUsername(username);
    if (existsUsername) conflictFields.push("username");

    const existsNickname = await this.userRepository.findByNickname(nickname);
    if (existsNickname) conflictFields.push("nickname");

    if (conflictFields.length > 0) {
      throw new CustomError("중복된 필드가 있습니다.", 409, conflictFields);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser({
      username,
      password: hashedPassword,
      nickname,
    });

    const accessToken = this.jwtService.generateAccessToken({
      id: createdUser.id,
      username: createdUser.username,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: createdUser.id,
      username: createdUser.username,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        username: createdUser.username,
        nickname: createdUser.nickname,
      },
    };
  }

  async login(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new CustomError("존재하지 않는 유저입니다.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      username: user.username,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        nickname: user.nickname,
      },
    };
  }

  async issueAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new CustomError("refresh 토큰이 필요합니다.", 400);
    }

    const decoded = this.jwtService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new CustomError("유효하지 않은 토큰입니다.", 401);
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: decoded.id,
      username: decoded.username,
    });

    return accessToken;
  }
}

module.exports = AuthService;
