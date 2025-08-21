"use strict";

const WebtoonRepository = require("@repositories/webtoon/webtoonRepository");
const UserRepository = require("@repositories/user/userRepository");
const CustomError = require("@utils/customError");

const DB_COLUMN = {
  favorite: "favorite_count",
  updated: "updated_at",
  view: "view_count",
  rate: "rating_avg",
};

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
    this.userRepository = new UserRepository();
  }

  async getWebtoons({ day, sort }) {
    const dbSortKey = DB_COLUMN[sort] ?? DB_COLUMN.favorite;

    let webtoons;

    if (day) {
      webtoons = await this.webtoonRepository.getWebtoonsByDaySorted(day, dbSortKey);
    } else {
      webtoons = await this.webtoonRepository.getAllWebtoonsSorted(dbSortKey);
    }
    return webtoons;
  }

  async getWebtoonDetail(webtoonId) {
    const detail = await this.webtoonRepository.getWebtoonById(webtoonId);
    if (!detail) {
      throw new CustomError("웹툰을 찾을 수 없습니다.", 404);
    }
    return detail;
  }

  async searchWebtoons(keyword) {
    const data = await this.webtoonRepository.getByKeyword(keyword.trim());
    return {
      total: data.length,
      results: data,
    };
  }
}

module.exports = WebtoonService;
