"use strict";

const CommentRepository = require("@repositories/comment/commentRepository.js");
const CustomError = require("@utils/customError");
const EpisodeRepository = require("@repositories/webtoon/episodeRepository.js");

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
    this.episodeRepository = new EpisodeRepository();
  }

  async createComment(episodeId, content, parentId, userId) {
    const existingEpisode = await this.episodeRepository.getEpisodeDetailById(episodeId);
    if (!existingEpisode) {
      throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
    }

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
  }

  async reactComment(commentId, type, userId) {
    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      throw new CustomError("대상 댓글이 존재하지 않습니다.", 404);
    }

    const existingReaction = await this.commentRepository.findReaction(commentId, userId);

    let finalReaction = null;

    if (existingReaction) {
      if (existingReaction.reactionType === type) {
        await this.commentRepository.deleteReaction(commentId, userId);
        finalReaction = null;
      } else {
        await this.commentRepository.updateReaction(commentId, userId, type);
        finalReaction = type;
      }
    } else {
      await this.commentRepository.createReaction(commentId, userId, type);
      finalReaction = type;
    }

    return {
      myReaction: finalReaction ? finalReaction : null,
    };
  }

  async getCommentsByEpisode(episodeId, userId) {
    const existingEpisode = await this.episodeRepository.getEpisodeDetailById(episodeId);
    if (!existingEpisode) throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);

    const comments = await this.commentRepository.getCommentsByEpisode(episodeId);

    const map = {};
    const roots = [];

    for (const comment of comments) {
      const reactions = await this.commentRepository.countReactions(comment.id);

      const userReaction = userId
        ? (await this.commentRepository.findReaction(comment.id, userId))?.reactionType || null
        : null;

      const commentObj = {
        id: comment.id,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          userId: comment.userId,
          username: comment.username,
          nickname: comment.nickname,
        },
        reaction: {
          likeCount: reactions.likeCount,
          dislikeCount: reactions.dislikeCount,
          userReaction,
        },
      };

      if (comment.parentId === null) {
        commentObj.children = [];
      }

      map[comment.id] = commentObj;
    }

    comments.forEach((comment) => {
      const commentObj = map[comment.id];
      if (comment.parentId) {
        const parent = map[comment.parentId];
        if (parent) parent.children.push(commentObj);
      } else {
        roots.push(commentObj);
      }
    });

    return {
      totalCount: comments.length,
      comments: roots,
    };
  }
}

module.exports = CommentService;
