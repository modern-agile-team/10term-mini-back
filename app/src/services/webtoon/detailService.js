"use strict";

const DetailRepository = require("../../repositories/webtoon/detailRepository");

class DetailService {
  constructor() {
    this.detailRepository = new DetailRepository();
  }

  async getWebtoonDetail(webtoonId) {
    try {
      const detail = await this.detailRepository.getWebtoonById(webtoonId);

      return {
        status: 200,
        success: true,
        data: { detail },
      };
    } catch (error) {
      console.error("An error occurred while fetching webtoon details.", error);
      return {
        status: 500,
        success: false,
        data: { message: "서버 오류가 발생했습니다." },
      };
    }
  }
}

module.exports = DetailService;
