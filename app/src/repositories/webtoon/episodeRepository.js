"use strict";

const db = require("../../config/db");

class EpisodeRepository {
  // 웹툰에 맞는 회차 불러오기
  async getEpisodeById(webtoonId) {
    const query = `
        SELECT
          episode_no,
          title,
          img_url,
          posted_time,
          rating_avg
        FROM episodes
        WHERE webtoon_id = ?
        `;
    try {
      const [rows] = await db.query(query, [webtoonId]);
      return rows;
    } catch (error) {
      console.error("DB Error [getEpisodeById]:", error);
      throw new Error("웹툰의 회차정보를 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = EpisodeRepository;
