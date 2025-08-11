"use strict";

const CommentService = require("@services/comment/commentService.js");
const commentService = new CommentService();

module.exports = {
  createComment: async (req, res) => {
    const { episodeId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    const newComment = await commentService.createComment(episodeId, content, parentId, userId);

    return res.status(201).json({
      success: true,
      data: {
        message: "댓글 작성 성공",
        content: newComment,
      },
    });
  },

  updateComment: async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const updatedComment = await commentService.updateComment(commentId, content, userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "댓글 수정 성공",
        content: updatedComment,
      },
    });
  },

  deleteComment: async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    await commentService.deleteComment(commentId, userId);

    return res.status(200).json({
      success: true,
      data: { message: "댓글 삭제 성공" },
    });
  },

  reactComment: async (req, res) => {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const reactionData = await commentService.reactComment(commentId, type, userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "댓글 반응 처리 완료",
        content: reactionData,
      },
    });
  },

  getCommentsByEpisode: async (req, res) => {
    const { episodeId } = req.params;
    const comments = await commentService.getCommentsByEpisode(episodeId);
    return res.status(200).json({
      success: true,
      data: {
        message: "댓글 목록 조회 성공",
        content: comments,
      },
    });
  },
};
