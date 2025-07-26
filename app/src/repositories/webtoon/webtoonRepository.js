const db = require("../../config/db");

class WebtoonRepository {
  // 전체 웹툰 조회
  async getAllWebtoons() {
    const query = `
    SELECT id, title, day_of_week, thumbnail_url
    FROM webtoons;
    `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("DB Error [getAllWebtoons]:", error);
      throw new Error("전체 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
  // 요일 필터로 웹툰 조회
  async getWebtoonsByDay(day) {
    const query = `
    SELECT id, title, day_of_week, thumbnail_url
    FROM webtoons
    WHERE day_of_week = ?;
    `;
    try {
      const [rows] = await db.query(query, [day]);
      return rows;
    } catch (error) {
      console.error("DB Error [getWebtoonsByDay]:", error);
      throw new Error("요일별 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = WebtoonRepository;
