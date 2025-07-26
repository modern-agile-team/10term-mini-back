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
    const { userName, password, nickname } = this.body;

    const conflictFields = [];

    const isUserNameExist = await this.userRepository.findByUserName(userName);
    if (isUserNameExist) conflictFields.push("userName");

    const isNicknameExist = await this.userRepository.findByNickname(nickname);
    if (isNicknameExist) conflictFields.push("nickname");

    if (conflictFields.length > 0) {
      return {
        status: 409,
        success: false,
        data: { fields: conflictFields },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser({
      userName,
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
          userName: createdUser.userName,
          nickname: createdUser.nickname,
        },
      },
    };
  }

  async login() {
    const { userName, password } = this.body;

    const user = await this.userRepository.findByUserName(userName);
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
      userName: user.username,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      userName: user.username,
    });

    return {
      status: 200,
      success: true,
      data: {
        message: "로그인 성공",
        accessToken,
        refreshToken,
        user: {
          userName: user.username,
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
      userName: decoded.userName,
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
