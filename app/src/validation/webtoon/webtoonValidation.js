"use strict";

const { query, param } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper");

const checkWebtoonQuery = createValidation(
  query("day")
    .optional()
    .isIn(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
    .withMessage("요일이 올바르지 않습니다."),

  query("sort")
    .optional()
    .isIn(["favorite", "view", "updated", "rate"])
    .withMessage("정렬이 올바르지 않습니다.")
);

const checkSearchQuery = createValidation(
  query("keyword")
    .notEmpty()
    .withMessage("검색어는 필수입니다.")
    .isLength({ min: 2 })
    .withMessage("검색어는 최소 2자 이상이어야 합니다.")
);

const checkWebtoonId = createValidation(
  param("webtoonId").isInt({ min: 1 }).withMessage("webtoonId는 1 이상의 정수여야 합니다.")
);

module.exports = {
  checkWebtoonQuery,
  checkSearchQuery,
  checkWebtoonId,
};
