"use strict";

const WebtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService {
  constructor() {
    this.webtoonRepository = new WebtoonRepository();
  }

  async getWebtoons(filters) {
    try {
      const { day } = filters;
      if (!day) {
        const allWebtoons = await this.webtoonRepository.getAllWebtoons();
        return {
          status: 200,
          success: true,
          data: { allWebtoons },
        };
      }
      const webtoonsByDay = await this.webtoonRepository.getWebtoonsByDay(day);
      return {
        status: 200,
        success: true,
        data: { webtoonsByDay },
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
