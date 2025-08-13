"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

class EpisodeRepository {
  // 웹툰에 맞는 전체 회차 불러오기
  async getEpisodesByWebtoonId(webtoonId) {
    const query = `
        SELECT
          ep.id,
          ep.episode_no,
          ep.title,
          ep.thumbnail_url,
          ep.posted_time,
          ep.rating_avg
        FROM episodes ep
        WHERE ep.webtoon_id = ?
        ORDER BY ep.episode_no ASC;
      `;
    const [rows] = await pool.query(query, [webtoonId]);
    return toCamelCase(rows);
  }

  // 회차클릭 후 만화 불러오기
  async getEpisodeDetailById(episodeId) {
    const query = `
        SELECT
          ep.id AS episode_id,
          ep.episode_no,
          ep.title AS episode_title,
          ep.full_img_url,
          wt.title AS webtoon_title
        FROM episodes ep
        JOIN webtoons wt ON ep.webtoon_id = wt.id
        WHERE ep.id = ?;
      `;
    const [rows] = await pool.query(query, [episodeId]);
    return toCamelCase(rows[0]);
  }

  // 별점 등록
  async createRating(conn, userId, episodeId, rating) {
    const query = `
      INSERT INTO ratings (user_id, episode_id, rating)
      VALUES (?, ?, ?);
    `;
    const [res] = await conn.query(query, [userId, episodeId, rating]);
    return res;
  }

  async applyNewRating(conn, episodeId, rating) {
    const query = `
      UPDATE episodes
      SET
        rating_sum = rating_sum + ?,
        rating_count = rating_count + 1,
        rating_avg = ROUND((rating_sum) / (rating_count), 2)
      WHERE id = ?;
    `;
    const [res] = await conn.query(query, [rating, rating, episodeId]);
    return res;
  }
}

module.exports = EpisodeRepository;
