const pool = require("../../config/db");

class WebtoonRepository {
  // 요일과 정렬조건을 기준으로 웹툰 데이터 조회
  async getWebtoonsByDaySorted(day, sort) {
    let query;
    if (sort === "rating_avg") {
      query = `
      SELECT 
        w.id,
        w.title,
        w.day_of_week,
        w.thumbnail_url,
        ROUND(AVG(e.rating_avg), 2) AS average_rating
      FROM webtoons w
      LEFT JOIN episodes e ON w.id = e.webtoon_id
      WHERE w.day_of_week = ?
      GROUP BY w.id
      ORDER BY average_rating DESC;
      `;
    } else {
      query = `
      SELECT 
        id, 
        title, 
        day_of_week, 
        thumbnail_url
      FROM webtoons
      WHERE day_of_week = ?
      ORDER BY ${sort} DESC;
      `;
    }
    try {
      const [rows] = await pool.query(query, [day]);
      return rows;
    } catch (error) {
      console.error("DB Error [getWebtoonsByDaySorted]: ", error);
      throw new Error("요일 + 정렬 조건으로 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
  // 요일조건 기준으로 웹툰 데이터 조회
  async getWebtoonsByDay(day) {
    const query = `
    SELECT 
      id, 
      title, 
      day_of_week, 
      thumbnail_url
    FROM webtoons
    WHERE day_of_week = ? 
    ORDER BY favorite_count DESC;
    `;
    try {
      const [rows] = await pool.query(query, [day]);
      return rows;
    } catch (error) {
      console.error("DB Error [getWebtoonsByDay]: ", error);
      throw new Error("요일 조건으로 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
  // 정렬조건을 기준으로 웹툰 데이터 조회
  async getAllWebtoonsSorted(sort) {
    let query;
    if (sort === "rating_avg") {
      query = `
      SELECT 
        w.id,
        w.title,
        w.day_of_week,
        w.thumbnail_url,
        ROUND(AVG(e.rating_avg), 2) AS average_rating
      FROM webtoons w
      LEFT JOIN episodes e ON w.id = e.webtoon_id
      GROUP BY w.id
      ORDER BY average_rating DESC;
      `;
    } else {
      query = `
      SELECT 
        id, 
        title, 
        day_of_week, 
        thumbnail_url
      FROM webtoons
      ORDER BY ${sort} DESC;
    `;
    }
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("DB Error [getAllWebtoonsSorted]: ", error);
      throw new Error("정렬 조건으로 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
  // 전체 웹툰 데이터 조회
  async getAllWebtoons() {
    const query = `
    SELECT 
      id, 
      title, 
      day_of_week, 
      thumbnail_url
    FROM webtoons
    ORDER BY favorite_count DESC;
    `;
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("DB Error [getAllWebtoons]: ", error);
      throw new Error("전체 웹툰 데이터를 가져오는 데 실패했습니다.");
    }
  }
  // 웹툰 상세 정보 불러오기
  async getWebtoonById(webtoonId) {
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
      WHERE id = ?;
      `;
    try {
      const [rows] = await pool.query(query, [webtoonId]);
      return rows[0];
    } catch (error) {
      console.error("DB Error [getWebtoonById]: ", error);
      throw new Error("웹툰의 상세정보를 가져오는 데 실패했습니다.");
    }
  }
}

module.exports = WebtoonRepository;
