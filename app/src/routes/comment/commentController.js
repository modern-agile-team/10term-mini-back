"use strict";

const CommentService = require("../../services/comment/commentService.js");

module.exports = {
  createComment: async (req, res) => {
    try {
      const { episodeId } = req.params;
      const { content, parentId } = req.body;
      const userId = req.user.id;

      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.createComment(
        episodeId,
        content,
        parentId,
        userId
      );

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
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.updateComment(
        commentId,
        content,
        userId
      );

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
      const { commentId } = req.params;
      const userId = req.user.id;

      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.deleteComment(commentId, userId);

      return res.status(status).json({ success, data });
    } catch (error) {
      console.error("deleteComment error: ", error);
      return res.status(500).json({
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },

  reactComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { type } = req.body;
      const userId = req.user.id;

      const commentService = new CommentService(req);
      const { status, success, data } = await commentService.reactComment(commentId, type, userId);

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
