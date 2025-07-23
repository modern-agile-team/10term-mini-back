"use strict";

const WebtoonService = require("../../services/webtoon/webtoonService");

const process = {
    //웹툰 조회
    getWebtoons: async (req, res) => {
        const webtoonService = new WebtoonService();
        const {status, data} = await webtoonService.getAllWebtoons();

        return res.status(status).json(data);
    },
};

module.exports = { 
    process, 
};