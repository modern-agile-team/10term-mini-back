"use strict";

const getDb = require("@utils/getDb");
const toCamelCase = require("@utils/toCamelCase");

const DB_COLUMN = {
  favorite: "favorite_count",
  updated: "updated_at",
  view: "wt_view_count",
  rate: "rating_avg",
};

class WebtoonRepository {
  // 요일 기준 정렬 조회
  async getWebtoonsByDaySorted(day, sort, conn) {
    const db = getDb(conn);
    let query;
    const dbSortKey = DB_COLUMN[sort] ?? DB_COLUMN.favorite;

    if (dbSortKey === "rating_avg") {
      query = `
        SELECT
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
        SELECT
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
        ORDER BY wt.${dbSortKey} DESC;
      `;
    }
    const [rows] = await db.query(query, [day]);
    return toCamelCase(rows);
  }
  // 정렬 조건 기준 전체 조회
  async getAllWebtoonsSorted(sort, conn) {
    const db = getDb(conn);
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
    const [rows] = await db.query(query);
    return toCamelCase(rows);
  }
  // 웹툰 상세 정보 불러오기
  async getWebtoonById(webtoonId, conn) {
    const db = getDb(conn);
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
    const [rows] = await db.query(query, [webtoonId]);
    return toCamelCase(rows[0]);
  }

  async updateFavoriteCount(webtoonId, increment, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE webtoons
      SET favorite_count = favorite_count + ?
      WHERE id = ?;
    `;
    await db.query(query, [increment, webtoonId]);
  }

  // 웹툰 조회수 증가
  async increaseWebtoonViewCountByEpisodeId(episodeId, conn) {
    const db = getDb(conn);
    const query = `
      UPDATE webtoons wt
      JOIN episodes ep ON ep.webtoon_id = wt.id
      SET wt.wt_view_count = wt.wt_view_count + 1
      WHERE ep.id = ?;
    `;
    const [ret] = await db.query(query, [episodeId]);
    return ret.affectedRows;
  }

  async getByKeyword(keyword, conn) {
    const db = getDb(conn);
    const query = `
      SELECT 
        wt.id, 
        wt.title, 
        wt.writer, 
        wt.illustrator,
        wt.description,
        wt.updated_at,
        wt.thumbnail_url,
        JSON_ARRAYAGG(wd.day_of_week) AS weekdays
      FROM webtoons AS wt
      LEFT JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
      LEFT JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
      WHERE wt.title LIKE ? OR wt.writer LIKE ?
      GROUP BY wt.id
      ORDER BY wt.favorite_count DESC;
    `;

    const [rows] = await db.query(query, [`%${keyword}%`, `%${keyword}%`]);
    return toCamelCase(rows);
  }
}

module.exports = WebtoonRepository;
