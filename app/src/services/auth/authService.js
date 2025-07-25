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
    const { userId, password, nickname } = this.body;

    const isUserIdExist = await this.userRepository.findByUserId(userId);
    const isNicknameExist = await this.userRepository.findByNickname(nickname);

    if (isUserIdExist && isNicknameExist) {
      return { status: 409, success: false, data: { field: "both" } };
    } else if (isUserIdExist) {
      return { status: 409, success: false, data: { field: "user_id" } };
    } else if (isNicknameExist) {
      return { status: 409, success: false, data: { field: "nickname" } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser({
      userId,
      password: hashedPassword,
      nickname,
    });

    return {
      status: 201,
      success: true,
      data: {
        field: null,
        message: "회원가입 성공",
        user: {
          userId: createdUser.user_id,
          nickname: createdUser.nickname,
        },
      },
    };
  }

  async login() {
    const { userId, password } = this.body;

    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      return {
        status: 404,
        success: false,
        data: { message: "존재하지 않는 아이디입니다." },
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
      userId: user.user_id,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      userId: user.user_id,
    });

    return {
      status: 200,
      success: true,
      data: {
        message: "로그인 성공",
        accessToken,
        refreshToken,
        user: {
          userId: user.user_id,
          nickname: user.nickname,
        },
      },
    };
  }

  async newAccessToken() {
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
      userId: decoded.user_id,
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
