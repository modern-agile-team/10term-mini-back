"use strict";

const AuthService = require("@services/auth/authService.js");
const { setRefreshToken, clearRefreshToken } = require("@utils/cookie.js");

module.exports = {
  signUp: async (req, res, next) => {
    const { username, password, nickname } = req.body;
    const authService = new AuthService();
    const data = await authService.signUp(username, password, nickname);

    if (data.refreshToken) {
      setRefreshToken(res, data.refreshToken);
      delete data.refreshToken;
    }

    return res.status(201).json({
      success: true,
      data: {
        message: "회원가입 성공",
        content: data,
      },
    });
  },

  login: async (req, res, next) => {
    const { username, password } = req.body;
    const authService = new AuthService();
    const data = await authService.login(username, password);

    if (data.refreshToken) {
      setRefreshToken(res, data.refreshToken);
      delete data.refreshToken;
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "로그인 성공",
        content: data,
      },
    });
  },

  issueAccessToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    const authService = new AuthService();
    const accessToken = await authService.issueAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        message: "access 토큰 발급 성공",
        content: accessToken,
      },
    });
  },

  logout: async (req, res, next) => {
    clearRefreshToken(res);

    return res.status(200).json({
      success: true,
      data: { message: "로그아웃 되었습니다." },
    });
  },
};
