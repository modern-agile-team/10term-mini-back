"use strict";

const WebtoonRepository = require("@repositories/webtoon/webtoonRepository.js");
const UserRepository = require("@repositories/user/userRepository.js");
const FavoriteRepository = require("@repositories/favorite/favoriteRepository.js");
const CustomError = require("@utils/customError");
const pool = require("@config/db.js");

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

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.favoriteRepository.addFavorite(userId, webtoonId, connection);
      await this.webtoonRepository.updateFavoriteCount(webtoonId, 1, connection);

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw new CustomError("관심 등록 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
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

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.favoriteRepository.removeFavorite(userId, webtoonId, connection);
      await this.webtoonRepository.updateFavoriteCount(webtoonId, -1, connection);

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw new CustomError("관심 해제 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
  }

  async getMyFavorites(userId, sort) {
    const favorites = await this.favoriteRepository.getFavoritesByUserId(userId, sort);
    return favorites;
  }

  async removeSelectedFavorites(userId, webtoonIds) {
    const existingFavorites = await this.favoriteRepository.findFavorites(userId, webtoonIds);
    const existingIds = existingFavorites.map((fav) => fav.webtoonId);
    if (existingIds.length === 0) return [];

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.favoriteRepository.removeSelectedFavorites(userId, existingIds, connection);

      await Promise.all(
        existingIds.map((webtoonId) =>
          this.webtoonRepository.updateFavoriteCount(webtoonId, -1, connection)
        )
      );
      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw new CustomError("선택한 관심 해제 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = FavoriteService;
