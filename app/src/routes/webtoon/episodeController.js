"use strict";

const EpisodeService = require("@services/webtoon/episodeService");
const episodeService = new EpisodeService();

module.exports = {
  // 웹툰 회차정보 조회
  getWebtoonEpisodes: async (req, res) => {
    const webtoonId = req.params.webtoonId;
    const episodes = await episodeService.getWebtoonEpisodes(webtoonId);

    return res.status(200).json({
      success: true,
      data: {
        message: "회차 조회 성공",
        content: episodes,
      },
    });
  },
  // 회차 상세 정보 조회
  getEpisodeDetail: async (req, res) => {
    const episodeId = req.params.episodeId;
    const episodeDetail = await episodeService.getEpisodeDetail(episodeId);

    return res.status(200).json({
      success: true,
      data: {
        message: "회차 상세정보 조회 성공",
        content: episodeDetail,
      },
    });
  },
};
