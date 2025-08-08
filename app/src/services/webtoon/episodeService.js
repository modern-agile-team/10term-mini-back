"use strict";

const EpisodeRepository = require("@repositories/webtoon/episodeRepository");
const CustomError = require("@utils/customError");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
  }

  async getWebtoonEpisodes(webtoonId) {
    const episodes = await this.episodeRepository.getEpisodesByWebtoonId(webtoonId);
    return episodes;
  }
  async getEpisodeDetail(episodeId) {
    const episode = await this.episodeRepository.getEpisodeDetailById(episodeId);
    if (!episode) {
      throw new CustomError("해당 에피소드를 찾을 수 없습니다.", 404);
    }
    return episode;
  }
}

module.exports = EpisodeService;
