"use strict";

const getDb = require("@utils/getDb");
const toCamelCase = require("@utils/toCamelCase");

class WebtoonRepository {
  // 요일 기준 정렬 조회
  async getWebtoonsByDaySorted(day, sort, conn) {
    const db = getDb(conn);
    let query;
    if (sort === "rating_avg") {
      query = `
        SELECT 
          wt.id,
          wt.title,
          wd.day_of_week AS weekdays,
          wt.thumbnail_url,
          ROUND(IFNULL(AVG(ep.rating_avg), 0), 2) AS average_rating
        FROM webtoons AS wt
        JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
        LEFT JOIN episodes AS ep ON wt.id = ep.webtoon_id
        WHERE wd.day_of_week = ?
        GROUP BY wt.id
        ORDER BY average_rating DESC;
      `;
    } else {
      query = `
        SELECT 
          wt.id,
          wt.title,
          wd.day_of_week AS weekdays,
          wt.thumbnail_url,
          ROUND(IFNULL(AVG(ep.rating_avg), 0), 2) AS average_rating
        FROM webtoons AS wt
        JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
        JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
        LEFT JOIN episodes AS ep ON wt.id = ep.webtoon_id
        WHERE wd.day_of_week = ?
        GROUP BY wt.id
        ORDER BY wt.${sort} DESC;
      `;
    }
    const [rows] = await db.query(query, [day]);
    return toCamelCase(rows);
  }
  // 정렬 조건 기준 전체 조회
  async getAllWebtoonsSorted(sort, conn) {
    const db = getDb(conn);
    let query;
    if (sort === "rating_avg") {
      query = `
      SELECT 
        wt.id,
        wt.title,
        JSON_ARRAYAGG(wd.day_of_week) AS weekdays,
        wt.thumbnail_url,
        ROUND(IFNULL(AVG(ep.rating_avg), 0), 2) AS average_rating
      FROM webtoons AS wt
      LEFT JOIN episodes AS ep ON wt.id = ep.webtoon_id
      LEFT JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
      LEFT JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
      GROUP BY wt.id
      ORDER BY average_rating DESC;
    `;
    } else {
      query = `
      SELECT 
        wt.id, 
        wt.title, 
        JSON_ARRAYAGG(wd.day_of_week) AS weekdays,
        wt.thumbnail_url
      FROM webtoons AS wt
      LEFT JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
      LEFT JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
      GROUP BY wt.id
      ORDER BY wt.${sort} DESC;
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
        JSON_ARRAYAGG(wd.day_of_week) AS weekdays,
        wt.age_rating, 
        wt.description, 
        wt.thumbnail_url, 
        wt.favorite_count
      FROM webtoons AS wt
      LEFT JOIN webtoon_weekdays AS wtd ON wt.id = wtd.webtoon_id
      LEFT JOIN weekdays AS wd ON wtd.weekdays_key = wd.id
      WHERE wt.id = ?
      GROUP BY wt.id;
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
  async increaseWebtoonViewCountByEpisodeId(conn, episodeId) {
    const query = `
      UPDATE webtoons wt
      JOIN episodes ep ON ep.webtoon_id = wt.id
      SET wt.wt_view_count = wt.wt_view_count + 1
      WHERE ep.id = ?;
    `;
    const [ret] = await conn.query(query, [episodeId]);
    return ret.affectedRows;
  }
}

module.exports = WebtoonRepository;
