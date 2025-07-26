"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const authCtrl = require("../auth/auth.ctrl.js");
const webtoonctrl = require("../webtoon/webtoon.ctrl");

// validation 미들웨어
const authValidation = require("../../validation/auth/authValidation.js");

router.post("/api/auth/signup", authValidation.checkAddUser, authCtrl.signUp);
router.post("/api/auth/login", authValidation.checkUser, authCtrl.login);
router.post("/api/auth/token", authCtrl.issueAccessToken);

router.get("/api/webtoons", webtoonctrl.process.getWebtoons);

module.exports = router;