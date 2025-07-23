"use strict";

const webtoonRepository = require("../../repositories/webtoon/webtoonRepository");

class WebtoonService  {
    constructor(req) {
        this.body = this.body;
    }

    async getAllWebtoons() {
        try {
            const webtoon = await webtoonRepository.getAllWebtoons();
            return {
                status: 200,
                data: { webtoon }
            };
        } catch (err) {
            console.error("웹툰 조회 중 에러:", err);
            return {
                status: 500,
                data: { error: "서버 오류",}
            };
        }
    }
}

module.exports = WebtoonService ;