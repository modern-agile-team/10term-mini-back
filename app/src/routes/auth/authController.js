"use strict";

const AuthService = require("../../services/auth/authService.js");

module.exports = {
  signUp: async (req, res) => {
    try {
      const authService = new AuthService(req);
      const { status, success, data } = await authService.signUp();

      if (data.refreshToken) {
        res.cookie("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        delete data.refreshToken;
      }

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("signUp error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  login: async (req, res) => {
    try {
      const authService = new AuthService(req);
      const { status, success, data } = await authService.login();

      if (data.refreshToken) {
        res.cookie("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        delete data.refreshToken;
      }

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("login error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  issueAccessToken: async (req, res) => {
    try {
      const authService = new AuthService(req);
      const { status, success, data } = await authService.issueAccessToken();
      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("issueAccessToken error:", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        success: true,
        data: { message: "로그아웃 되었습니다." },
      });
    } catch (error) {
      console.error("logout error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
};
