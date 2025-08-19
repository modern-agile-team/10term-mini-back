"use strict";

const FavoriteService = require("@services/favorite/favoriteService.js");
const favoriteService = new FavoriteService();

module.exports = {
  addFavorite: async (req, res) => {
    const userId = req.user.id;
    const webtoonId = req.params.webtoonId;
    await favoriteService.addFavorite(userId, webtoonId);

    return res.status(200).json({
      success: true,
      data: { message: "웹툰을 관심 목록에 추가했습니다." },
    });
  },

  removeFavorite: async (req, res) => {
    const userId = req.user.id;
    const webtoonId = req.params.webtoonId;
    await favoriteService.removeFavorite(userId, webtoonId);

    return res.status(200).json({
      success: true,
      data: { message: "웹툰을 관심 목록에서 삭제했습니다." },
    });
  },
};
