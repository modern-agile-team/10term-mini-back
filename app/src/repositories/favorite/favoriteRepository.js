"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class FavoriteRepository {
  static ALLOWED_SORTS = {
    RECENT: "wf.created_at DESC",
    UPDATED: "w.id DESC",
  };

  async findFavorite(userId, webtoonId) {
    const query = `
      SELECT *
      FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id = ?;
    `;
    const [rows] = await pool.query(query, [userId, webtoonId]);
    return rows.length ? toCamelCase(rows[0]) : null;
  }

  async addFavorite(userId, webtoonId) {
    const query = `
      INSERT INTO webtoon_favorites (user_id, webtoon_id)
      VALUES (?, ?);
    `;
    await pool.query(query, [userId, webtoonId]);
  }

  async removeFavorite(userId, webtoonId) {
    const query = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id = ?;
    `;
    await pool.query(query, [userId, webtoonId]);
  }

  async findFavoritesByUserId(userId, sort) {
    const key = (sort || "updated").toUpperCase();
    const orderBy = FavoriteRepository.ALLOWED_SORTS[key];

    const query = `
      SELECT
        wf.webtoon_id,
        w.title,
        w.writer,
        w.thumbnail_url,
        w.updated_at,
        wf.created_at
      FROM webtoon_favorites wf
      JOIN webtoons w ON wf.webtoon_id = w.id
      WHERE wf.user_id = ?
      ORDER BY ${orderBy};
    `;

    const [rows] = await pool.query(query, [userId]);
    return toCamelCase(rows);
  }

  async removeSelectedFavorites(userId, webtoonIds) {
    const placeholders = webtoonIds.map(() => "?").join(",");

    const selectQuery = `
      SELECT webtoon_id
      FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${placeholders});
    `;
    const [existingRows] = await pool.query(selectQuery, [userId, ...webtoonIds]);
    const existingIds = existingRows.map((r) => r.webtoon_id);

    if (existingIds.length === 0) return [];

    const deletePlaceholders = existingIds.map(() => "?").join(",");

    const deleteQuery = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${deletePlaceholders});
    `;
    await pool.query(deleteQuery, [userId, ...existingIds]);

    return existingIds;
  }
}

module.exports = FavoriteRepository;
