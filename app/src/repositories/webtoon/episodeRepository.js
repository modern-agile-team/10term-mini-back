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
    try {
      const [rows] = await pool.query(query, [webtoonId]);
      return rows;
    } catch (error) {
      console.error("DB Error [getEpisodesByWebtoonId]:", error);
      throw new Error("웹툰의 회차정보를 가져오는 데 실패했습니다.");
    }
  }
  // 회차 상세정보 불러오기
  async getEpisodeDetailById(episodeId) {
    const query = `
        SELECT
          e.id AS episodeId,
          e.episode_no,
          e.title AS episodeTitle,
          e.full_img_url,
          w.title AS webtoonTitle
        FROM episodes e
        JOIN webtoons w ON e.webtoon_id = w.id
        WHERE e.id = ?;
        `;
    try {
      const [rows] = await pool.query(query, [episodeId]);
      return toCamelCase(rows[0]);
    } catch (error) {
      console.error("DB Error [getEpisodeDetailById]:", error);
      throw new Error("회차의 상세정보를 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = EpisodeRepository;
