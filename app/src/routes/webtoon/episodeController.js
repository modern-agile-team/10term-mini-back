"use strict";

const EpisodeService = require("@services/webtoon/episodeService");
const episodeService = new EpisodeService();

const process = {
  // 웹툰 회차정보 조회
  getWebtoonEpisodes: async (req, res) => {
    try {
      const webtoonId = req.params.webtoonId;
      const { status, success, data } = await episodeService.getWebtoonEpisodes(webtoonId);
      return res.status(status).json({
        status,
        success,
        data,
      });
    } catch (error) {
      console.error("An error occurred while retrieving webtoon episode information.", error);
      return res.status(500).json({
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
  // 회차 상세 정보 조회
  getEpisodeDetail: async (req, res) => {
    try {
      const episodeId = req.params.episodeId;
      const { status, success, data } = await episodeService.getEpisodeDetail(episodeId);
      return res.status(status).json({
        status,
        success,
        data,
      });
    } catch (error) {
      console.error("An error occurred while retrieving episode detail.", error);
      return res.status(500).json({
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
};

module.exports = {
  process,
};
