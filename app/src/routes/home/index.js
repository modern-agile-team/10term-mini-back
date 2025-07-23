"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const authCtrl = require("../auth/auth.ctrl.js");
const webtoonctrl = require("../webtoon/webtoon.ctrl");

// validation 컨트롤러
const authValidation = require("../../validation/auth/authValidation.js");

router.get("/api/webtoon", webtoonctrl.process.getWebtoon);
router.post("/auth/signup", authValidation.checkAddUser, authCtrl.process.signUp);
router.post("/auth/login", authValidation.checkUser, authCtrl.process.login);

module.exports = router;