"use strict";

const { body, param } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper");

const checkEpisodeIdParam = createValidation(
  param("episodeId")
    .bail()
    .isInt({ min: 1 })
    .withMessage("episodeId는 1 이상의 정수 형태 문자열이어야 합니다.")
);
const checkRating = createValidation(
  body("rating")
    .bail()
    .isInt({ min: 1, max: 10 })
    .withMessage("rating은 1 이상 10 이하의 정수 형태 문자열이어야 합니다.")
);

module.exports = {
  checkEpisodeIdParam,
  checkRating,
};
