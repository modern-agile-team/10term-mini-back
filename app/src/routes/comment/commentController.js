"use strict";

const CommentService = require("../../services/comment/commentService.js");

module.exports = {
  createComment: async (req, res) => {
    try {
      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.createComment();

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("createComment error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  updateComment: async (req, res) => {
    try {
      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.updateComment();

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("updateComment error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.deleteComment();

      return res.status(status).json({ success, data });
    } catch (error) {
      console.log("deleteComment error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  reactComment: async (req, res) => {
    try {
      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.reactComment();

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("reactComment error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
};
