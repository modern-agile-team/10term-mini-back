"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const authCtrl = require("../auth/authController.js");
const webtoonCtrl = require("../webtoon/webtoonController.js");
const episodeCtrl = require("../webtoon/episodeController.js");

// validation 미들웨어
const authValidation = require("../../validation/auth/authValidation.js");
const webtoonValidation = require("../../validation/webtoon/webtoonValidation.js");

router.post("/api/auth/signup", authValidation.checkAddUser, authCtrl.signUp);
router.post("/api/auth/login", authValidation.checkUser, authCtrl.login);
router.post("/api/auth/token", authCtrl.issueAccessToken);
router.post("/api/auth/logout", authCtrl.logout);

router.get("/api/webtoons", webtoonValidation.checkWebtoonQuery, webtoonCtrl.process.getWebtoons);
router.get(
  "/api/webtoons/:webtoonId",
  webtoonValidation.checkWebtoonId,
  webtoonCtrl.process.getDetail
);
router.get(
  "/api/webtoons/:webtoonId/episodes",
  webtoonValidation.checkWebtoonId,
  episodeCtrl.process.getEpisode
);

module.exports = router;
