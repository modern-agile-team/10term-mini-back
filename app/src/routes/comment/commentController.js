"use strict";

const CommentService = require("@services/comment/commentService.js");

module.exports = {
  createComment: async (req, res, next) => {
    const { episodeId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    const commentService = new CommentService();
    const newComment = await commentService.createComment(episodeId, content, parentId, userId);

    return res.status(201).json({
      success: true,
      data: {
        message: "댓글 작성 성공",
        content: newComment,
      },
    });
  },

  updateComment: async (req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const commentService = new CommentService();
    const updatedComment = await commentService.updateComment(commentId, content, userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "댓글 수정 성공",
        content: updatedComment,
      },
    });
  },

  deleteComment: async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    const commentService = new CommentService();
    await commentService.deleteComment(commentId, userId);

    return res.status(200).json({
      success: true,
      data: { message: "댓글 삭제 성공" },
    });
  },

  reactComment: async (req, res, next) => {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const commentService = new CommentService();
    const reactionData = await commentService.reactComment(commentId, type, userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "댓글 반응 처리 완료",
        content: reactionData,
      },
    });
  },
};
