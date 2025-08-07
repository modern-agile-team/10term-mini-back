"use strict";

const { param } = require("express-validator");
const { createValidation } = require("../../common/middleware/validationHelper.js");

const checkEpisodeId = createValidation(
  param("episodeId").isInt({ min: 1 }).withMessage("episodeId는 1 이상의 정수여야 합니다.")
);

module.exports = {
  checkEpisodeId,
};
