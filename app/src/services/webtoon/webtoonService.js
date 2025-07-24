"use strict";

const webtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService {
  async getWebtoons(filters) {
    try {
      const { day } = filters;
      if (!day) {
        const webtoons = await webtoonRepository.getAllWebtoons();
        return {
          status: 200,
          success: true,
          data: { webtoons },
        };
      } else if (day) {
        const webtoons = await webtoonRepository.getWebtoonsByDay(day);
        return {
          status: 200,
          success: true,
          data: { webtoons },
        };
      } else {
        return {
          status: 400,
          success: false,
          data: { message: "지원하지 않는 필터 조건입니다." },
        };
      }
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
