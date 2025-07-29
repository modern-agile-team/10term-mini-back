"use strict";

const WebtoonRepository = require("../../repositories/webtoon/webtoonRepository");

const DB_COLUMN = {
  like: "like_count",
  updated: "updated_at",
  view: "view_count",
  rate: "rating_avg",
};

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
  }

  async getWebtoons(filters) {
    try {
      const { day, sort } = filters;

      const dbSortKey = DB_COLUMN[sort];
      if (sort && !dbSortKey) throw new Error("유효하지 않은 sort 값입니다.");

      let webtoons;

      if (day) {
        if (dbSortKey) {
          webtoons = await this.webtoonRepository.getWebtoonsByDaySorted(day, dbSortKey);
        } else {
          webtoons = await this.webtoonRepository.getWebtoonsByDay(day);
        }
      } else if (dbSortKey) {
        webtoons = await this.webtoonRepository.getAllWebtoonsSorted(dbSortKey);
      } else {
        webtoons = await this.webtoonRepository.getAllWebtoons();
      }

      return {
        status: 200,
        success: true,
        data: { webtoons },
      };
    } catch (error) {
      console.error("Error occurred while fetching webtoons:", error);
      return {
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      };
    }
  }
}

module.exports = WebtoonService;
