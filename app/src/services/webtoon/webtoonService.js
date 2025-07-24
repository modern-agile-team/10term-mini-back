"use strict";

const webtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService {
  async getAllWebtoons() {
    try {
      const webtoon = await webtoonRepository.getAllWebtoons();
      return {
        status: 200,
        success: true,
        data: { webtoon },
      };
    } catch (error) {
      console.error("Error occurred while fetching webtoons:", error);
      return {
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      };
    }
  }
}

module.exports = WebtoonService;
