const db = require("../../config/db");

class WebtoonRepository {
    static async getAllWebtoons() {
        const query = "SELECT * FROM webtoons";
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (err) {
            console.error("DB 조회 에러:", err);
            throw Error("웹툰 조회 실패");
        }
    };

}

module.exports = WebtoonRepository;