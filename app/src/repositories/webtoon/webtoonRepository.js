"use strict";

const pool = require("@config/db");
const toCamelCase = require("@utils/toCamelCase.js");

const DB_COLUMN = {
  favorite: "favorite_count",
  updated: "updated_at",
  view: "wt_view_count",
  rate: "rating_avg",
};

class WebtoonRepository {
  // 요일 기준 정렬 조회
  async getWebtoonsByDaySorted(day, sort) {
    let query;
    const dbSortKey = DB_COLUMN[sort] ?? DB_COLUMN.favorite;
    if (dbSortKey === "rating_avg") {
      query = `
        SELECT DISTINCT
          wt.id,
          wt.title,
          wd.day_of_week AS weekday,
          wt.thumbnail_url,
          ROUND(IFNULL(e.avg_rating, 0), 2) AS average_rating
        FROM webtoons wt
        JOIN webtoon_weekdays wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays wd ON wd.id = wtd.weekdays_key
        LEFT JOIN (
          SELECT webtoon_id, AVG(rating_avg) AS avg_rating
          FROM episodes
          GROUP BY webtoon_id
        ) e ON e.webtoon_id = wt.id
        WHERE wd.day_of_week = ?
        ORDER BY average_rating DESC;
      `;
    } else {
      query = `
        SELECT DISTINCT
          wt.id,
          wt.title,
          wd.day_of_week AS weekday,
          wt.thumbnail_url
        FROM webtoons wt
        JOIN webtoon_weekdays wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays wd ON wd.id = wtd.weekdays_key
        WHERE wd.day_of_week = ?
        ORDER BY wt.${dbSortKey} DESC;
      `;
    }
    const [rows] = await pool.query(query, [day]);
    return toCamelCase(rows);
  }
  // 정렬 조건 기준 전체 조회
  async getAllWebtoonsSorted(sort) {
    let query;
    const dbSortKey = DB_COLUMN[sort] ?? DB_COLUMN.favorite;
    if (dbSortKey === "rating_avg") {
      query = `
        SELECT DISTINCT
          wt.id,
          wt.title,
          wt.thumbnail_url,
          wd.day_of_week AS weekday,
          ROUND(IFNULL(e.avg_rating, 0), 2) AS average_rating
        FROM webtoons wt
        JOIN webtoon_weekdays wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays wd ON wd.id = wtd.weekdays_key
        LEFT JOIN (
          SELECT webtoon_id, AVG(rating_avg) AS avg_rating
          FROM episodes
          GROUP BY webtoon_id
        ) e ON e.webtoon_id = wt.id
        ORDER BY average_rating DESC;
      `;
    } else {
      query = `
        SELECT DISTINCT
          wt.id,
          wt.title,
          wt.thumbnail_url,
          wd.day_of_week AS weekday
        FROM webtoons wt
        JOIN webtoon_weekdays wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays wd ON wd.id = wtd.weekdays_key
        ORDER BY wt.${dbSortKey} DESC;
      `;
    }
    const [rows] = await pool.query(query);
    return toCamelCase(rows);
  }
  // 웹툰 상세 정보 불러오기
  async getWebtoonById(webtoonId) {
    const query = `
      SELECT
        wt.id,
        wt.title,
        wt.writer,
        wt.illustrator,
        COALESCE(w.weekdays, JSON_ARRAY()) AS weekdays,
        wt.age_rating,
        wt.description,
        wt.thumbnail_url,
        wt.favorite_count
      FROM webtoons wt
      LEFT JOIN (
        SELECT
          d.webtoon_id,
          JSON_ARRAYAGG(d.day_of_week) AS weekdays
        FROM (
          SELECT DISTINCT
            wtd.webtoon_id AS webtoon_id,
            wd.day_of_week  AS day_of_week
          FROM webtoon_weekdays wtd
          JOIN weekdays wd ON wd.id = wtd.weekdays_key
        ) d
        GROUP BY d.webtoon_id
      ) w ON w.webtoon_id = wt.id
      WHERE wt.id = ?;
    `;
    const [rows] = await pool.query(query, [webtoonId]);
    return toCamelCase(rows[0]);
  }

  async updateFavoriteCount(webtoonId, increment, conn) {
    const query = `
      UPDATE webtoons
      SET favorite_count = favorite_count + ?
      WHERE id = ?;
    `;
    await conn.query(query, [increment, webtoonId]);
  }
}

module.exports = WebtoonRepository;
