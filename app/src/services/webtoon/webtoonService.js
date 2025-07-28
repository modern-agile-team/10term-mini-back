"use strict";

const WebtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
  }

  async getWebtoons(filters) {
    try {
      const { day, sort } = filters;

      const dbKey = {
        like: "like_count",
        updated: "updated_at",
        view: "view_count",
        rate: "rating_avg",
      };

      const dbSortKey = dbKey[sort];

      if (sort && !dbSortKey) throw new Error("유효하지 않은 sort 값입니다.");

      if (day) {
        if (dbSortKey) {
          const webtoonsByDaySorted = await this.webtoonRepository.getWebtoonsByDaySorted(
            day,
            dbSortKey
          );
          return {
            status: 200,
            success: true,
            data: { webtoonsByDaySorted },
          };
        }
        const webtoonsByDay = await this.webtoonRepository.getWebtoonsByDay(day);
        return {
          status: 200,
          success: true,
          data: { webtoonsByDay },
        };
      }

      if (dbSortKey) {
        const allWebtoonsSorted = await this.webtoonRepository.getAllWebtoonsSorted(dbSortKey);
        return {
          status: 200,
          success: true,
          data: { allWebtoonsSorted },
        };
      }

      const allWebtoons = await this.webtoonRepository.getAllWebtoons();
      return {
        status: 200,
        success: true,
        data: { allWebtoons },
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
