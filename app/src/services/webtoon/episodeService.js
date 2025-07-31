"use strict";

const EpisodeRepository = require("../../repositories/webtoon/episodeRepository");
const { convertUTCtoKST } = require("../../utils/dateUtil");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
  }

  async getWebtoonEpisodes(webtoonId) {
    try {
      const episodes = await this.episodeRepository.getEpisodeById(webtoonId);
      episodes.forEach((episode) => {
        episode.posted_time = convertUTCtoKST(episode.posted_time);
      });
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
}

module.exports = EpisodeService;
