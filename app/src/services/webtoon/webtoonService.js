"use strict";

const WebtoonRepository = require("@repositories/webtoon/webtoonRepository");

const DB_COLUMN = {
  favorite: "favorite_count",
  updated: "updated_at",
  view: "view_count",
  rate: "rating_avg",
};

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
  }

  async getWebtoons(filters) {
    const { day, sort } = filters;

    const dbSortKey = DB_COLUMN[sort];

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
  }

  async getWebtoonDetail(webtoonId) {
    const detail = await this.webtoonRepository.getWebtoonById(webtoonId);

    return {
      status: 200,
      success: true,
      data: { detail },
    };
  }
}

module.exports = WebtoonService;
