"use strict";

const webtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService {
  async getWebtoons(filters) {
    try {
      const { day } = filters;
      if (!day) {
        const allWebtoons = await webtoonRepository.getAllWebtoons();
        return {
          status: 200,
          success: true,
          data: { allWebtoons },
        };
      } else if (day) {
        const webtoonsByDay = await webtoonRepository.getWebtoonsByDay(day);
        return {
          status: 200,
          success: true,
          data: { webtoonsByDay },
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
