"use strict";

const WebtoonRepository = require("@repositories/webtoon/webtoonRepository.js");
const UserRepository = require("@repositories/user/userRepository.js");
const FavoriteRepository = require("@repositories/favorite/favoriteRepository.js");
const CustomError = require("@utils/customError");

class FavoriteService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
    this.userRepository = new UserRepository();
    this.favoriteRepository = new FavoriteRepository();
  }

  async addFavorite(userId, webtoonId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError("존재하지 않는 유저입니다.", 404);

    const webtoon = await this.webtoonRepository.getWebtoonById(webtoonId);
    if (!webtoon) throw new CustomError("웹툰을 찾을 수 없습니다.", 404);

    const existingFavorite = await this.favoriteRepository.findFavorite(userId, webtoonId);
    if (existingFavorite) {
      throw new CustomError("이미 관심 목록에 추가된 웹툰입니다.", 409);
    }

    await this.favoriteRepository.addFavorite(userId, webtoonId);
    await this.webtoonRepository.updateFavoriteCount(webtoonId, 1);
  }

  async removeFavorite(userId, webtoonId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError("존재하지 않는 유저입니다.", 404);

    const webtoon = await this.webtoonRepository.getWebtoonById(webtoonId);
    if (!webtoon) throw new CustomError("웹툰을 찾을 수 없습니다.", 404);

    const existingFavorite = await this.favoriteRepository.findFavorite(userId, webtoonId);
    if (!existingFavorite) {
      throw new CustomError("관심 목록에 없는 웹툰입니다.", 404);
    }

    await this.favoriteRepository.removeFavorite(userId, webtoonId);
    await this.webtoonRepository.updateFavoriteCount(webtoonId, -1);
  }

  async getMyFavorites(userId, sort) {
    const favorites = await this.favoriteRepository.findFavoritesByUserId(userId, sort);
    return favorites;
  }

  async removeSelectedFavorites(userId, webtoonIds) {
    const deletedWebtoonIds = await this.favoriteRepository.removeSelectedFavorites(
      userId,
      webtoonIds
    );

    for (const webtoonId of deletedWebtoonIds) {
      await this.webtoonRepository.updateFavoriteCount(webtoonId, -1);
    }
  }
}

module.exports = FavoriteService;
