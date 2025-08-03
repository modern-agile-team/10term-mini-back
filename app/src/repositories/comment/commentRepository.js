"use strict";

const pool = require("../../config/db");

class CommentRepository {
  async findById(commentId) {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM comments 
      WHERE id = ?;
      `,
      [commentId]
    );
    return rows[0];
  }

  async createComment({ episodeId, userId, content, parentId }) {
    const [result] = await pool.query(
      `
      INSERT INTO comments (episode_id, user_id, content, parent_id) 
      VALUES (?, ?, ?, ?);
      `,
      [episodeId, userId, content, parentId]
    );

    const [newRows] = await pool.query(
      `
        SELECT *
        FROM comments
        WHERE id = ?;
        `,
      [result.insertId]
    );

    return newRows[0];
  }

  async updateComment(commentId, { content }) {
    await pool.query(
      `
      UPDATE comments
      SET content = ?
      WHERE id = ?;
      `,
      [content, commentId]
    );

    const [updateRows] = await pool.query(
      `
      SELECT *
      FROM comments
      WHERE id = ?;
      `,
      [commentId]
    );

    return updateRows[0];
  }

  async deleteComment(commentId) {
    await pool.query(
      `
      DELETE FROM comments
      WHERE id = ?;
      `,
      [commentId]
    );
  }

  async findReaction(commentId, userId) {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM comment_likes
      WHERE comment_id = ? AND user_id = ?;
      `,
      [commentId, userId]
    );
    return rows[0];
  }

  async insertReaction(commentId, userId, type) {
    await pool.query(
      `
      INSERT INTO comment_likes (comment_id, user_id, reaction_type)
      VALUES (?, ?, ?);
      `,
      [commentId, userId, type]
    );
  }

  async updateReaction(commentId, userId, type) {
    await pool.query(
      `
      UPDATE comment_likes
      SET reaction_type = ?, updated_at = CURRENT_TIMESTAMP
      WHERE comment_id = ? AND user_id = ?;
      `,
      [type, commentId, userId]
    );
  }

  async deleteReaction(commentId, userId) {
    await pool.query(
      `
      DELETE FROM comment_likes
      WHERE comment_id = ? AND user_id = ?;
      `,
      [commentId, userId]
    );
  }

  async countReactions(commentId) {
    const [rows] = await pool.query(
      `
      SELECT 
        SUM(reaction_type = 'like') AS likeCount,
        SUM(reaction_type = 'dislike') AS dislikeCount
      FROM comment_likes
      WHERE comment_id = ?;
      `,
      [commentId]
    );

    return {
      likeCount: Number(rows[0].likeCount) || 0,
      dislikeCount: Number(rows[0].dislikeCount) || 0,
    };
  }
}

module.exports = CommentRepository;
