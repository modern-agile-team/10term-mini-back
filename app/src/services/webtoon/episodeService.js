"use strict";

const EpisodeRepository = require("../../repositories/webtoon/episodeRepository");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
  }

  async getWebtoonEpisodes(webtoonId) {
    try {
      const episodes = await this.episodeRepository.getEpisodesByWebtoonId(webtoonId);

      return {
        status: 200,
        success: true,
        data: { episodes },
      };
    } catch (error) {
      console.error("An error occurred while retrieving webtoon episode information.", error);
      return {
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      };
    }
  }
  async getEpisodeDetail(episodeId) {
    try {
      const episode = await this.episodeRepository.getEpisodeDetailById(episodeId);
      if (!episode) {
        return {
          status: 404,
          success: false,
          data: { message: "해당 에피소드를 찾을 수 없습니다." },
        };
      }
      return {
        status: 200,
        success: true,
        data: { episode },
      };
    } catch (error) {
      console.error("An error occurred while retrieving episode detail.", error);
      return {
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      };
    }
  }
}

module.exports = EpisodeService;
