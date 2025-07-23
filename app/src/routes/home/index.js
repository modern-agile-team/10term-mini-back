"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const ctrl = require("./home.ctrl");
const webtoonctrl = require("../webtoon/webtoon.ctrl");

router.get("/", ctrl.output.home);
router.get("/api/webtoon", webtoonctrl.process.getWebtoons);

module.exports = router;