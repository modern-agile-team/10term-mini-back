"use strict";

const EpisodeRepository = require("../../repositories/webtoon/episodeRepository");
const { convertUTCtoKST } = require("../../utils/dateUtil");

class EpisodeService {
  constructor() {
    this.episodeRepository = new EpisodeRepository();
  }

  // snake_case → camelCase 변환 함수
  mapEpisodeKeys(episode) {
    return {
      episodeNo: episode.episode_no,
      title: episode.title,
      imgUrl: episode.img_url,
      postedTime: convertUTCtoKST(episode.posted_time),
      ratingAvg: episode.rating_avg,
    };
  }

  async getWebtoonEpisodes(webtoonId) {
    try {
      const rawEpisodes = await this.episodeRepository.getEpisodeById(webtoonId);
      const episodes = rawEpisodes.map((ep) => this.mapEpisodeKeys(ep));

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
