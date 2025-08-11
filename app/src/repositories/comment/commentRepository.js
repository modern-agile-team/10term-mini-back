"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class CommentRepository {
  async findById(commentId) {
    const query = `
      SELECT * 
      FROM comments 
      WHERE id = ?;
    `;
    const [rows] = await pool.query(query, [commentId]);
    return toCamelCase(rows[0]);
  }

  async createComment({ episodeId, userId, content, parentId }) {
    const query = `
      INSERT INTO comments (episode_id, user_id, content, parent_id) 
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await pool.query(query, [episodeId, userId, content, parentId]);

    const newComment = await this.findById(result.insertId);
    return newComment;
  }

  async updateComment(commentId, { content }) {
    const query = `
      UPDATE comments
      SET content = ?
      WHERE id = ?;
    `;
    await pool.query(query, [content, commentId]);

    const updatedComment = await this.findById(commentId);
    return updatedComment;
  }

  async deleteComment(commentId) {
    const query = `
      DELETE FROM comments
      WHERE id = ?;
    `;
    await pool.query(query, [commentId]);
  }

  async findReaction(commentId, userId) {
    const query = `
      SELECT * 
      FROM comment_reactions
      WHERE comment_id = ? AND user_id = ?;
    `;
    const [rows] = await pool.query(query, [commentId, userId]);
    return toCamelCase(rows[0]);
  }

  async createReaction(commentId, userId, type) {
    const query = `
      INSERT INTO comment_reactions (comment_id, user_id, reaction_type)
      VALUES (?, ?, ?);
    `;
    await pool.query(query, [commentId, userId, type]);
  }

  async updateReaction(commentId, userId, type) {
    const query = `
      UPDATE comment_reactions
      SET reaction_type = ?, updated_at = CURRENT_TIMESTAMP
      WHERE comment_id = ? AND user_id = ?;
    `;
    await pool.query(query, [type, commentId, userId]);
  }

  async deleteReaction(commentId, userId) {
    const query = `
      DELETE FROM comment_reactions
      WHERE comment_id = ? AND user_id = ?;
    `;
    await pool.query(query, [commentId, userId]);
  }

  async countReactions(commentId) {
    const query = `
      SELECT 
        SUM(reaction_type = 'like') AS like_count,
        SUM(reaction_type = 'dislike') AS dislike_count
      FROM comment_reactions
      WHERE comment_id = ?;
    `;
    const [rows] = await pool.query(query, [commentId]);
    const result = toCamelCase(rows[0]);

    return {
      likeCount: Number(result.likeCount) || 0,
      dislikeCount: Number(result.dislikeCount) || 0,
    };
  }

  async getCommentsByEpisode(episodeId) {
    const query = `
      SELECT *
      FROM comments
      WHERE episode_id = ?
      ORDER BY created_at ASC;
    `;
    const [rows] = await pool.query(query, [episodeId]);
    return toCamelCase(rows);
  }
}

module.exports = CommentRepository;
