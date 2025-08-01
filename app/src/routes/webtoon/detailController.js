"use strict";

const DetailService = require("../../services/webtoon/detailService");
const detailService = new DetailService();

const process = {
  //웹툰 상세내용 조회
  getDetail: async (req, res) => {
    try {
      const webtoonId = req.params.webtoonId;
      const { status, success, data } = await detailService.getWebtoonDetail(webtoonId);
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
