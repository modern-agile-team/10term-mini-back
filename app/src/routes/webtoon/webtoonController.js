"use strict";

const WebtoonService = require("../../services/webtoon/webtoonService");
const webtoonService = new WebtoonService();

const process = {
  // 웹툰 조회
  getWebtoons: async (req, res) => {
    try {
      const filters = req.query;
      const { status, success, data } = await webtoonService.getWebtoons(filters);
      return res.status(status).json({
        status,
        success,
        data,
      });
    } catch (error) {
      console.error("An error occurred while fetching all webtoons: ", error);
      return res.status(500).json({
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      });
    }
  },
  // 웹툰 상세내용 조회
  getDetail: async (req, res) => {
    try {
      const webtoonId = req.params.webtoonId;
      const { status, success, data } = await webtoonService.getWebtoonDetail(webtoonId);
      return res.status(status).json({
        status,
        success,
        data,
      });
    } catch (error) {
      console.error("An error occurred while retrieving webtoon details: ", error);
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
