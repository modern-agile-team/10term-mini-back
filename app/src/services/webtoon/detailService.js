"use strict";

const DetailRepository = require("../../repositories/webtoon/detailRepository");

class DetailService {
  constructor() {
    this.detailRepository = new DetailRepository();
  }

  // snake_case → camelCase 변환 함수
  mapDetailKeys(detail) {
    return {
      id: detail.id,
      title: detail.title,
      writer: detail.writer,
      illustrator: detail.illustrator,
      dayOfWeek: detail.day_of_week,
      ageRating: detail.age_rating,
      description: detail.description,
      thumbnailUrl: detail.thumbnail_url,
      favoriteCount: detail.favorite_count,
    };
  }

  async getWebtoonDetail(webtoonId) {
    try {
      const dbDetail = await this.detailRepository.getWebtoonById(webtoonId);
      const detail = this.mapDetailKeys(dbDetail);

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
