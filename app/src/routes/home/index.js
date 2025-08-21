"use strict";

const express = require("express");
const router = express.Router();

// 컨트롤러
const authCtrl = require("@routes/auth/authController");
const webtoonCtrl = require("@routes/webtoon/webtoonController");
const episodeCtrl = require("@routes/webtoon/episodeController");
const commentCtrl = require("@routes/comment/commentController");
const userCtrl = require("@routes/user/userController");
const favoriteCtrl = require("@routes/favorite/favoriteController");

// 미들웨어
const authValidation = require("@validation/auth/authValidation");
const webtoonValidation = require("@validation/webtoon/webtoonValidation");
const episodeValidation = require("@validation/webtoon/episodeValidation");
const commentValidation = require("@validation/comment/commentValidation");
const userValidation = require("@validation/user/userValidation");
const favoriteValidation = require("@validation/favorite/favoriteValidation");
const { requireAuth, optionalAuth } = require("@middleware/authMiddleware");

// 인증(Authentication) API
router.post("/api/auth/signup", authValidation.checkAddUser, authCtrl.signUp);
router.post("/api/auth/login", authValidation.checkUser, authCtrl.login);
router.post("/api/auth/token", authCtrl.issueAccessToken);
router.post("/api/auth/logout", authCtrl.logout);

// 웹툰 및 에피소드 조회 API
router.get("/api/webtoons", webtoonValidation.checkWebtoonQuery, webtoonCtrl.getWebtoons);
router.get(
  "/api/webtoons/:webtoonId",
  optionalAuth,
  webtoonValidation.checkWebtoonId,
  webtoonCtrl.getDetail
);
router.post(
  "/api/webtoons/:webtoonId/favorite",
  requireAuth,
  webtoonValidation.checkWebtoonId,
  favoriteCtrl.addFavorite
);
router.delete(
  "/api/webtoons/:webtoonId/favorite",
  requireAuth,
  webtoonValidation.checkWebtoonId,
  favoriteCtrl.removeFavorite
);
router.get(
  "/api/webtoons/:webtoonId/episodes",
  webtoonValidation.checkWebtoonId,
  episodeCtrl.getWebtoonEpisodes
);
router.get(
  "/api/episodes/:episodeId",
  optionalAuth,
  episodeValidation.checkEpisodeIdParam,
  episodeCtrl.getEpisodeDetail
);
router.post(
  "/api/episodes/:episodeId/view-count",
  episodeValidation.checkEpisodeIdParam,
  episodeCtrl.addEpisodeView
);

// 댓글 API
router.post(
  "/api/episodes/:episodeId/comments",
  requireAuth,
  commentValidation.checkEpisodeIdParam,
  commentValidation.checkAddComment,
  commentCtrl.createComment
);
router.post(
  "/api/episodes/:episodeId/ratings",
  requireAuth,
  episodeValidation.checkEpisodeIdParam,
  episodeValidation.checkRating,
  episodeCtrl.rateEpisode
);
router.patch(
  "/api/comments/:commentId",
  requireAuth,
  commentValidation.checkCommentIdParam,
  commentValidation.checkUpdateComment,
  commentCtrl.updateComment
);
router.delete(
  "/api/comments/:commentId",
  requireAuth,
  commentValidation.checkCommentIdParam,
  commentCtrl.deleteComment
);
router.put(
  "/api/comments/:commentId/reaction",
  requireAuth,
  commentValidation.checkCommentIdParam,
  commentValidation.checkReactionType,
  commentCtrl.reactComment
);
router.get(
  "/api/episodes/:episodeId/comments",
  commentValidation.checkEpisodeIdParam,
  commentCtrl.getCommentsByEpisode
);

// 마이페이지 API
router.get("/api/users/me", requireAuth, userCtrl.getMyInfo);
router.patch(
  "/api/users/me/nickname",
  requireAuth,
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
  requireAuth,
  userValidation.checkPasswordUpdate,
  userCtrl.updatePassword
);
router.get(
  "/api/users/me/favorites",
  requireAuth,
  favoriteValidation.checkSortParam,
  userCtrl.getMyFavorites
);
router.delete(
  "/api/users/me/favorites",
  requireAuth,
  favoriteValidation.checkDeleteWebtoonIds,
  userCtrl.removeSelectedFavorites
);

module.exports = router;
