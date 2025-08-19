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

  async getEpisodeDetail(episodeId, userId) {
    const episode = await this.episodeRepository.getEpisodeDetailById(episodeId, userId);
    if (!episode) {
      throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
    }
    if (episode.hasRated !== undefined && episode.hasRated !== null) {
      episode.hasRated = !!episode.hasRated;
    }
    return episode;
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
