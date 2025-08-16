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

  async toggleFavorite(userId, webtoonId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError("존재하지 않는 유저입니다.", 404);
    }

    const webtoon = await this.webtoonRepository.getWebtoonById(webtoonId);
    if (!webtoon) {
      throw new CustomError("웹툰을 찾을 수 없습니다.", 404);
    }

    const existingFavorite = await this.webtoonRepository.findFavorite(userId, webtoonId);

    let isFavorited;
    if (existingFavorite) {
      await this.webtoonRepository.deleteFavorite(userId, webtoonId);
      await this.webtoonRepository.updateFavoriteCount(webtoonId, -1);
      isFavorited = false;
    } else {
      await this.webtoonRepository.createFavorite(userId, webtoonId);
      await this.webtoonRepository.updateFavoriteCount(webtoonId, 1);
      isFavorited = true;
    }

    return isFavorited;
  }
}

module.exports = WebtoonService;
