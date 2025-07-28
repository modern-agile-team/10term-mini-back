"use strict";

const WebtoonService = require("../../services/webtoon/webtoonService");

const process = {
  //전체 웹툰 조회
  getWebtoons: async (req, res) => {
    try {
      const webtoonService = new WebtoonService();
      const { status, success, data } = await webtoonService.getAllWebtoons();
      return res.status(status).json({
        status,
        success,
        data,
      });
    } catch (error) {
      console.log("Error occurred while fetching all webtoons: ", error);
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
