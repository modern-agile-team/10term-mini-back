const db = require("../../config/db");

class WebtoonRepository {
  static async getAllWebtoons() {
    const query = "SELECT * FROM webtoons";
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error occurred during DB query for webtoons:", error);
      throw new Error("데이터베이스에서 웹툰을 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = WebtoonRepository;
