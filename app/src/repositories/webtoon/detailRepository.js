"use strict";

const db = require("../../config/db");

class DetailRepository {
  // 웹툰 상세 정보 불러오기
  async getWebtoonByWebtoonId(webtoonId) {
    const query = `
      SELECT 
        id, 
        title, 
        writer, 
        illustrator, 
        day_of_week, 
        age_rating, 
        description, 
        thumbnail_url, 
        favorite_count
      FROM webtoons
      WHERE id = ?
      `;
    try {
      const [rows] = await db.query(query, [webtoonId]);
      return rows[0];
    } catch (error) {
      console.error("DB Error [getWebtoonById]:", error);
      throw new Error("웹툰의 상세정보를 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = DetailRepository;
