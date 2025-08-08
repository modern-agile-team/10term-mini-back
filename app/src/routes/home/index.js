"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const authCtrl = require("@routes/auth/authController.js");
const webtoonCtrl = require("@routes/webtoon/webtoonController.js");
const episodeCtrl = require("@routes/webtoon/episodeController.js");
const commentCtrl = require("@routes/comment/commentController.js");
const userCtrl = require("@routes/user/userController.js");

// 미들웨어
const authValidation = require("@validation/auth/authValidation.js");
const webtoonValidation = require("@validation/webtoon/webtoonValidation.js");
const episodeValidation = require("@validation/webtoon/episodeValidation.js");
const commentValidation = require("@validation/comment/commentValidation.js");
const userValidation = require("@validation/user/userValidation.js");
const authMiddleware = require("@middleware/authMiddleware.js");

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
  episodeCtrl.process.getWebtoonEpisodes
);
router.get(
  "/api/episodes/:episodeId",
  episodeValidation.checkEpisodeId,
  episodeCtrl.process.getEpisodeDetail
);
router.post(
  "/api/episodes/:episodeId/comments",
  authMiddleware,
  commentValidation.checkEpisodeIdParam,
  commentValidation.checkAddComment,
  commentCtrl.createComment
);
router.patch(
  "/api/comments/:commentId",
  authMiddleware,
  commentValidation.checkCommentIdParam,
  commentValidation.checkUpdateComment,
  commentCtrl.updateComment
);
router.delete(
  "/api/comments/:commentId",
  authMiddleware,
  commentValidation.checkCommentIdParam,
  commentCtrl.deleteComment
);
router.put(
  "/api/comments/:commentId/reaction",
  authMiddleware,
  commentValidation.checkCommentIdParam,
  commentValidation.checkReactionType,
  commentCtrl.reactComment
);

router.get("/api/users/me", authMiddleware, userCtrl.getMyInfo);
router.patch(
  "/api/users/me/nickname",
  authMiddleware,
  userValidation.checkNicknameUpdate,
  userCtrl.updateNickname
);
router.get(
  "/api/users/nicknames/:nickname",
  userValidation.checkNicknameParam,
  userCtrl.checkNicknameDuplicate
);
router.patch(
  "/api/users/me/password",
  authMiddleware,
  userValidation.checkPasswordUpdate,
  userCtrl.updatePassword
);
module.exports = router;
