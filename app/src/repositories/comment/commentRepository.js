"use strict";

const getDb = require("@utils/getDb");
const toCamelCase = require("@utils/toCamelCase");

class CommentRepository {
  async findById(commentId, conn) {
    const db = getDb(conn);
    const query = `
      SELECT * 
      FROM comments 
      WHERE id = ?;
    `;
    const [rows] = await db.query(query, [commentId]);
    return toCamelCase(rows[0]);
  }

  async createComment({ episodeId, userId, content, parentId }, conn) {
    const db = getDb(conn);
    const query = `
      INSERT INTO comments (episode_id, user_id, content, parent_id) 
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [episodeId, userId, content, parentId]);

    const newComment = await this.findById(result.insertId);
    return newComment;
  }

  async updateComment(commentId, { content }, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE comments
      SET content = ?
      WHERE id = ?;
    `;
    await db.query(query, [content, commentId]);

    const updatedComment = await this.findById(commentId);
    return updatedComment;
  }

  async deleteComment(commentId, conn) {
    const db = getDb(conn);
    const query = `
      DELETE FROM comments
      WHERE id = ?;
    `;
    await db.query(query, [commentId]);
  }

  async findReaction(commentId, userId, conn) {
    const db = getDb(conn);
    const query = `
      SELECT * 
      FROM comment_reactions
      WHERE comment_id = ? AND user_id = ?;
    `;
    const [rows] = await db.query(query, [commentId, userId]);
    return toCamelCase(rows[0]);
  }

  async createReaction(commentId, userId, type, conn) {
    const db = getDb(conn);
    const query = `
      INSERT INTO comment_reactions (comment_id, user_id, reaction_type)
      VALUES (?, ?, ?);
    `;
    await db.query(query, [commentId, userId, type]);
  }

  async updateReaction(commentId, userId, type, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE comment_reactions
      SET reaction_type = ?, updated_at = CURRENT_TIMESTAMP
      WHERE comment_id = ? AND user_id = ?;
    `;
    await db.query(query, [type, commentId, userId]);
  }

  async deleteReaction(commentId, userId, conn) {
    const db = getDb(conn);
    const query = `
      DELETE FROM comment_reactions
      WHERE comment_id = ? AND user_id = ?;
    `;
    await db.query(query, [commentId, userId]);
  }

  async countReactions(commentId, conn) {
    const db = getDb(conn);
    const query = `
      SELECT 
        SUM(reaction_type = 'like') AS like_count,
        SUM(reaction_type = 'dislike') AS dislike_count
      FROM comment_reactions
      WHERE comment_id = ?;
    `;
    const [rows] = await db.query(query, [commentId]);
    const result = toCamelCase(rows[0]);

    return {
      likeCount: Number(result.likeCount) || 0,
      dislikeCount: Number(result.dislikeCount) || 0,
    };
  }

  async getCommentsByEpisode(episodeId, conn) {
    const db = getDb(conn);
    const query = `
      SELECT *
      FROM comments
      WHERE episode_id = ?
      ORDER BY created_at ASC;
    `;
    const [rows] = await db.query(query, [episodeId]);
    return toCamelCase(rows);
  }
}

module.exports = CommentRepository;
