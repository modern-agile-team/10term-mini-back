"use strict";

const WebtoonService = require("@services/webtoon/webtoonService");
const webtoonService = new WebtoonService();

module.exports = {
  // 웹툰 조회
  getWebtoons: async (req, res) => {
    const filters = req.query;
    const webtoons = await webtoonService.getWebtoons(filters);

    return res.status(200).json({
      success: true,
      data: {
        message: "웹툰 조회 성공",
        content: webtoons,
      },
    });
  },

  // 웹툰 상세내용 조회
  getDetail: async (req, res) => {
    const webtoonId = req.params.webtoonId;
    const detail = await webtoonService.getWebtoonDetail(webtoonId);
    return res.status(200).json({
      success: true,
      data: {
        message: "웹툰 상세정보 조회 성공",
        content: detail,
      },
    });
  },

  toggleFavorite: async (req, res) => {
    const userId = req.user.id;
    const webtoonId = req.params.webtoonId;
    const isFavorited = await webtoonService.toggleFavorite(userId, webtoonId);

    return res.status(200).json({
      success: true,
      data: {
        message: isFavorited
          ? "웹툰을 관심 목록에 추가했습니다."
          : "웹툰을 관심 목록에서 삭제했습니다.",
      },
    });
  },
};
