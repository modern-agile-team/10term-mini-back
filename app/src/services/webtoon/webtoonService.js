"use strict";

const WebtoonRepository = require("@repositories/webtoon/webtoonRepository");
const FavoriteRepository = require("@repositories/favorite/favoriteRepository");
const UserRepository = require("@repositories/user/userRepository");
const CustomError = require("@utils/customError");

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
    this.favoriteRepository = new FavoriteRepository();
    this.userRepository = new UserRepository();
  }

  async getWebtoons({ day, sort }) {
    let webtoons;

    if (day) {
      webtoons = await this.webtoonRepository.getWebtoonsByDaySorted(day, sort);
    } else {
      webtoons = await this.webtoonRepository.getAllWebtoonsSorted(sort);
    }
    return webtoons;
  }

  async getWebtoonDetail(webtoonId, userId) {
    const detail = await this.webtoonRepository.getWebtoonById(webtoonId);
    if (!detail) {
      throw new CustomError("웹툰을 찾을 수 없습니다.", 404);
    }

    if (userId) {
      const favorite = await this.favoriteRepository.findFavorite(userId, webtoonId);
      detail.isFavorite = !!favorite;
    } else {
      detail.isFavorite = false;
    }

    return detail;
  }

  async searchWebtoons(keyword) {
    const results = await this.webtoonRepository.getByKeyword(keyword.trim());
    return results;
  }
}

module.exports = WebtoonService;
