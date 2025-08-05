"use strict";

const CommentRepository = require("../../repositories/comment/commentRepository.js");

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(episodeId, content, parentId, userId) {
    if (parentId) {
      const parentComment = await this.commentRepository.findById(parentId);
      if (!parentComment) {
        return {
          status: 400,
          success: false,
          data: { message: "존재하지 않는 부모 댓글입니다." },
        };
      }

      if (parentComment.parentId) {
        return {
          status: 400,
          success: false,
          data: { message: "대댓글에는 다시 대댓글을 달 수 없습니다." },
        };
      }
    }

    const newComment = await this.commentRepository.createComment({
      episodeId: Number(episodeId),
      userId: userId,
      content,
      parentId: parentId || null,
    });

    return {
      status: 201,
      success: true,
      data: {
        message: "댓글 작성 성공",
        content: newComment,
      },
    };
  }

  async updateComment(commentId, content, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      return {
        status: 404,
        success: false,
        data: { message: "수정할 댓글이 존재하지 않습니다." },
      };
    }

    if (existingComment.userId !== userId) {
      return {
        status: 403,
        success: false,
        data: { message: "본인만 댓글을 수정할 수 있습니다." },
      };
    }

    const updatedComment = await this.commentRepository.updateComment(commentId, { content });

    return {
      status: 200,
      success: true,
      data: {
        message: "댓글 수정 성공",
        content: updatedComment,
      },
    };
  }

  async deleteComment(commentId, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      return {
        status: 404,
        success: false,
        data: { message: "삭제할 댓글이 존재하지 않습니다." },
      };
    }

    if (existingComment.userId !== userId) {
      return {
        status: 403,
        success: false,
        data: { message: "본인만 댓글을 삭제할 수 있습니다." },
      };
    }

    await this.commentRepository.deleteComment(commentId);

    return {
      status: 200,
      success: true,
      data: { message: "댓글 삭제 성공" },
    };
  }

  async reactComment(commentId, type, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      return {
        status: 404,
        success: false,
        data: { message: "대상 댓글이 존재하지 않습니다." },
      };
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
      status: 200,
      success: true,
      data: {
        message: "댓글 반응 처리 완료",
        reactions: reactionCounts,
        myReaction: finalReaction ? finalReaction.type : null,
      },
    };
  }
}
module.exports = CommentService;
