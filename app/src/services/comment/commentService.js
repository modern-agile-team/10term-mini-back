"use strict";

const CommentRepository = require("@repositories/comment/commentRepository.js");
const CustomError = require("@utils/customError");

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(episodeId, content, parentId, userId) {
    if (parentId) {
      const parentComment = await this.commentRepository.findById(parentId);
      if (!parentComment) {
        throw new CustomError("존재하지 않는 부모 댓글입니다.", 400);
      }
      if (parentComment.parentId) {
        throw new CustomError("대댓글에는 다시 대댓글을 달 수 없습니다.", 400);
      }
    }

    const newComment = await this.commentRepository.createComment({
      episodeId: Number(episodeId),
      userId: userId,
      content,
      parentId: parentId || null,
    });

    return newComment;
  }

  async updateComment(commentId, content, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      throw new CustomError("수정할 댓글이 존재하지 않습니다.", 404);
    }
    if (existingComment.userId !== userId) {
      throw new CustomError("본인만 댓글을 수정할 수 있습니다.", 403);
    }

    const updatedComment = await this.commentRepository.updateComment(commentId, { content });

    return updatedComment;
  }

  async deleteComment(commentId, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      throw new CustomError("삭제할 댓글이 존재하지 않습니다.", 404);
    }
    if (existingComment.userId !== userId) {
      throw new CustomError("본인만 댓글을 삭제할 수 있습니다.", 403);
    }

    await this.commentRepository.deleteComment(commentId);

    return true;
  }

  async reactComment(commentId, type, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      throw new CustomError("대상 댓글이 존재하지 않습니다.", 404);
    }

    const existingReaction = await this.commentRepository.findReaction(commentId, userId);

    let finalReaction = null;

    if (type === null) {
      if (existingReaction) {
        await this.commentRepository.deleteReaction(commentId, userId);
        finalReaction = null;
      }
    } else {
      if (existingReaction) {
        if (existingReaction.type === type) {
          await this.commentRepository.deleteReaction(commentId, userId);
          finalReaction = null;
        } else {
          await this.commentRepository.updateReaction(commentId, userId, type);
          finalReaction = { type };
        }
      } else {
        await this.commentRepository.createReaction(commentId, userId, type);
        finalReaction = { type };
      }
    }

    const reactionCounts = await this.commentRepository.countReactions(commentId);

    return {
      reactions: reactionCounts,
      myReaction: finalReaction ? finalReaction.type : null,
    };
  }
}
module.exports = CommentService;
