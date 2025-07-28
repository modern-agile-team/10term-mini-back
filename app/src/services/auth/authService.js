"use strict";

const UserRepository = require("../../repositories/user/userRepository");
const JwtService = require("../../utils/jwtService");
const bcrypt = require("bcrypt");

class AuthService {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.userRepository = new UserRepository();
    this.jwtService = new JwtService();
  }

  async signUp() {
    const { username, password, nickname } = this.body;

    const conflictFields = [];

    const existsUsername = await this.userRepository.findByUsername(username);
    if (existsUsername) conflictFields.push("username");

    const existsNickname = await this.userRepository.findByNickname(nickname);
    if (existsNickname) conflictFields.push("nickname");

    if (conflictFields.length > 0) {
      return {
        status: 409,
        success: false,
        data: { fields: conflictFields },
      };
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
      status: 201,
      success: true,
      data: {
        field: null,
        message: "회원가입 성공",
        accessToken,
        refreshToken,
        user: {
          username: createdUser.username,
          nickname: createdUser.nickname,
        },
      },
    };
  }

  async login() {
    const { username, password } = this.body;

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return {
        status: 401,
        success: false,
        data: { message: "존재하지 않는 유저입니다." },
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        success: false,
        data: { message: "비밀번호가 일치하지 않습니다." },
      };
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
      status: 200,
      success: true,
      data: {
        message: "로그인 성공",
        accessToken,
        refreshToken,
        user: {
          username: user.username,
          nickname: user.nickname,
        },
      },
    };
  }

  async issueAccessToken() {
    const refreshToken = this.req.cookies?.refreshToken;
    if (!refreshToken) {
      return {
        status: 400,
        success: false,
        data: { message: "refresh 토큰이 필요합니다." },
      };
    }

    const decoded = this.jwtService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return {
        status: 401,
        success: false,
        data: { message: "유효하지 않은 토큰입니다." },
      };
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: decoded.id,
      username: decoded.username,
    });

    return {
      status: 200,
      success: true,
      data: {
        message: "access 토큰 재발급 성공",
        accessToken,
      },
    };
  }
}

module.exports = AuthService;
