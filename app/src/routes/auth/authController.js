"use strict";

const AuthService = require("@services/auth/authService.js");
const { setRefreshToken, clearRefreshToken } = require("@utils/cookie.js");

module.exports = {
  signUp: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  issueAccessToken: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      clearRefreshToken(res);

      return res.status(200).json({
        success: true,
        data: { message: "로그아웃 되었습니다." },
      });
    } catch (error) {
      next(error);
    }
  },
};
