"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class FavoriteRepository {
  static ALLOWED_SORTS = {
    RECENT: "wf.created_at DESC",
    UPDATED: "w.id DESC",
  };

  async executeQuery(query, params = [], conn) {
    if (conn) {
      return conn.query(query, params);
    }
    return pool.query(query, params);
  }

  async findFavorite(userId, webtoonId, conn) {
    const query = `
      SELECT *
      FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id = ?;
    `;
    const [rows] = await this.executeQuery(query, [userId, webtoonId], conn);
    return rows.length ? toCamelCase(rows[0]) : null;
  }

  async addFavorite(userId, webtoonId, conn) {
    const query = `
      INSERT INTO webtoon_favorites (user_id, webtoon_id)
      VALUES (?, ?);
    `;
    await this.executeQuery(query, [userId, webtoonId], conn);
  }

  async removeFavorite(userId, webtoonId, conn) {
    const query = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id = ?;
    `;
    await this.executeQuery(query, [userId, webtoonId], conn);
  }

  async getFavoritesByUserId(userId, sort, conn) {
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
    const [rows] = await this.executeQuery(query, [userId], conn);
    return toCamelCase(rows);
  }

  async findFavorites(userId, webtoonIds, conn) {
    const placeholders = webtoonIds.map(() => "?").join(",");
    const query = `
      SELECT *
      FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${placeholders});
    `;
    const [rows] = await this.executeQuery(query, [userId, ...webtoonIds], conn);
    return toCamelCase(rows);
  }

  async removeSelectedFavorites(userId, webtoonIds, conn) {
    const placeholders = webtoonIds.map(() => "?").join(",");
    const query = `
      DELETE FROM webtoon_favorites
      WHERE user_id = ? AND webtoon_id IN (${placeholders});
    `;
    await this.executeQuery(query, [userId, ...webtoonIds], conn);
  }
}

module.exports = FavoriteRepository;
