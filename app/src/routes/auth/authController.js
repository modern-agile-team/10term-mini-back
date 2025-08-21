"use strict";

const AuthService = require("@services/auth/authService");
const { setRefreshToken, clearRefreshToken } = require("@utils/cookie");
const authService = new AuthService();
function handleRefreshToken(res, data) {
  if (data.refreshToken) {
    setRefreshToken(res, data.refreshToken);
    delete data.refreshToken;
  }
}

module.exports = {
  signUp: async (req, res) => {
    const { username, password, nickname } = req.body;
    const data = await authService.signUp(username, password, nickname);

    handleRefreshToken(res, data);

    return res.status(201).json({
      success: true,
      data: {
        message: "회원가입 성공",
        content: data,
      },
    });
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const data = await authService.login(username, password);

    handleRefreshToken(res, data);

    return res.status(200).json({
      success: true,
      data: {
        message: "로그인 성공",
        content: data,
      },
    });
  },

  issueAccessToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = await authService.issueAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        message: "access 토큰 발급 성공",
        content: accessToken,
      },
    });
  },

  logout: async (req, res) => {
    clearRefreshToken(res);

    return res.status(200).json({
      success: true,
      data: { message: "로그아웃 되었습니다." },
    });
  },
};
