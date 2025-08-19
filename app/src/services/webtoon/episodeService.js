"use strict";

const EpisodeRepository = require("@repositories/webtoon/episodeRepository");
const CustomError = require("@utils/customError");
const pool = require("@config/db");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
  }

  async getWebtoonEpisodes(webtoonId) {
    const episodes = await this.episodeRepository.getEpisodesByWebtoonId(webtoonId);
    return episodes;
  }

  async openEpisodeDetail(episodeId, userId) {
    let connection;
    try {
      connection = await pool.getConnection();

      await connection.beginTransaction();

      const episode = await this.episodeRepository.getEpisodeDetailById(
        connection,
        episodeId,
        userId
      );

      if (!episode) {
        await connection.rollback();
        throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
      }
      const webtoonId = episode.webtoonId;
      if (!webtoonId) {
        await connection.rollback();
        throw new CustomError("에피소드에 연결된 웹툰 정보를 찾을 수 없습니다.", 500);
      }

      await this.episodeRepository.increaseEpisodeViewCount(connection, episodeId);
      await this.episodeRepository.increaseWebtoonViewCount(connection, webtoonId);

      if (episode.hasRated != null) {
        episode.hasRated = Boolean(episode.hasRated);
      }

      await connection.commit();
      return episode;
    } catch (err) {
      if (connection) await connection.rollback();
      throw new CustomError("회차 불러오는 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
  }

  async rateEpisode(userId, episodeId, rating) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.episodeRepository.createRating(connection, userId, episodeId, rating);
      const stats = await this.episodeRepository.applyNewRating(connection, episodeId, rating);

      if (!stats) {
        throw new CustomError("존재하지 않는 에피소드입니다.", 404);
      }

      await connection.commit();

      return {
        episodeId,
        ratingAvg: stats.ratingAvg,
        ratingCount: stats.ratingCount,
      };
    } catch (err) {
      if (connection) {
        await connection.rollback();
      }
      if (err && err.code === "ER_DUP_ENTRY") {
        throw new CustomError("이미 이 에피소드에 평점을 등록했습니다.", 409);
      }
      if (err && err.code === "ER_NO_REFERENCED_ROW_2") {
        throw new CustomError("존재하지 않는 에피소드입니다.", 404);
      }
      throw new CustomError("평점 등록 중 오류 발생", 500);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = EpisodeService;
