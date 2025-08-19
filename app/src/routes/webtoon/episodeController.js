"use strict";

const EpisodeService = require("@services/webtoon/episodeService");
const episodeService = new EpisodeService();

module.exports = {
  // 웹툰 회차정보 조회
  getWebtoonEpisodes: async (req, res) => {
    const { webtoonId } = req.params;
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
  openEpisode: async (req, res) => {
    const { episodeId } = req.params;
    const userId = req.user?.id ?? null;
    const episodeDetail = await episodeService.openEpisodeDetail(episodeId, userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "회차 상세정보 조회 성공",
        content: episodeDetail,
      },
    });
  },

  // 별점 추가/업데이트
  rateEpisode: async (req, res) => {
    const { episodeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const insertResult = await episodeService.rateEpisode(userId, episodeId, rating);

    return res.status(201).json({
      success: true,
      data: {
        message: "별점 추가 성공",
        content: insertResult,
      },
    });
  },
};
