"use strict";

const AuthService = require("../../services/auth/authService.js");

const process = {
  signUp: async (req, res) => {
    try {
      const authService = new AuthService(req);
      const { status, success, data } = await authService.signUp();
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
      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("login error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
  newAccessToken: async (req, res) => {
    try {
      const authService = new AuthService(req);
      const { status, success, data } = await authService.newAccessToken();
      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("newAccessToken error:", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
};

module.exports = { process };
