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

  async addFavorite(userId, webtoonId, conn) {
    const query = `
      INSERT INTO webtoon_favorites (user_id, webtoon_id)
      VALUES (?, ?);
    `;
    await conn.query(query, [userId, webtoonId]);
  }

  async removeFavorite(userId, webtoonId, conn) {
    const query = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id = ?;
    `;
    await conn.query(query, [userId, webtoonId]);
  }

  async getFavoritesByUserId(userId, sort) {
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

  async findFavorites(userId, webtoonIds) {
    const placeholders = webtoonIds.map(() => "?").join(",");
    const query = `
      SELECT *
      FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${placeholders});
    `;
    const [rows] = await pool.query(query, [userId, ...webtoonIds]);
    return toCamelCase(rows);
  }

  async removeSelectedFavorites(userId, webtoonIds, conn) {
    const placeholders = webtoonIds.map(() => "?").join(",");
    const query = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${placeholders});
    `;
    await conn.query(query, [userId, ...webtoonIds]);
  }
}

module.exports = FavoriteRepository;
