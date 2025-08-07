"use strict";

const pool = require("../../config/db");
const toCamelCase = require("../../common/utils/toCamelCase.js");

class EpisodeRepository {
  // 웹툰에 맞는 회차 불러오기
  async getEpisodesByWebtoonId(webtoonId) {
    const query = `
        SELECT
          id,
          episode_no,
          title,
          thumbnail_url,
          posted_time,
          rating_avg
        FROM episodes
        WHERE webtoon_id = ?;
        `;
    const [rows] = await pool.query(query, [webtoonId]);
    return rows;
  }

  // 회차 상세정보 불러오기
  async getEpisodeDetailById(episodeId) {
    const query = `
        SELECT
          e.id AS episode_id,
          e.episode_no,
          e.title AS episode_title,
          e.full_img_url,
          w.title AS webtoon_title
        FROM episodes e
        JOIN webtoons w ON e.webtoon_id = w.id
        WHERE e.id = ?;
        `;
    const [rows] = await pool.query(query, [episodeId]);
    return toCamelCase(rows[0]);
  }
}

module.exports = EpisodeRepository;
