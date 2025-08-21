"use strict";

const EpisodeRepository = require("@repositories/webtoon/episodeRepository");
const webtoonRepository = require("@repositories/webtoon/webtoonRepository.js");
const CustomError = require("@utils/customError");
const pool = require("@config/db");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
    this.webtoonRepository = new webtoonRepository();
  }

  async getWebtoonEpisodes(webtoonId) {
    const episodes = await this.episodeRepository.getEpisodesByWebtoonId(webtoonId);
    return episodes;
  }

  async getEpisodeDetail(episodeId, userId) {
    const episode = await this.episodeRepository.getEpisodeDetailById(episodeId, userId);

    if (!episode) {
      throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
    }

    if (episode.hasRated != null) {
      episode.hasRated = Boolean(episode.hasRated);
    }

    return episode;
  }

  async addEpisodeView(episodeId) {
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [epRows, wtRows] = await Promise.all([
        this.episodeRepository.increaseEpisodeViewCount(connection, episodeId),
        this.webtoonRepository.increaseWebtoonViewCountByEpisodeId(connection, episodeId),
      ]);

      if (epRows !== 1 || wtRows !== 1) {
        throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
      }

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();

      if (error instanceof CustomError) {
        throw new CustomError(error.message, error.statusCode);
      }

      throw new CustomError("회차 조회수 증가 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
  }

  async rateEpisode(userId, episodeId, rating) {
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      await this.episodeRepository.createRating(userId, episodeId, rating, connection);
      const stats = await this.episodeRepository.applyNewRating(episodeId, rating, connection);

      if (!stats) {
        throw new CustomError("존재하지 않는 에피소드입니다.", 404);
      }

      await connection.commit();

      return {
        episodeId,
        ratingAvg: stats.ratingAvg,
        ratingCount: stats.ratingCount,
      };
    } catch (error) {
      if (connection) await connection.rollback();

      if (error && error.code === "ER_DUP_ENTRY") {
        throw new CustomError("이미 이 에피소드에 평점을 등록했습니다.", 409);
      }

      if (error && error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new CustomError("존재하지 않는 에피소드입니다.", 404);
      }

      throw new CustomError("평점 등록 중 오류 발생", 500);
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = EpisodeService;
