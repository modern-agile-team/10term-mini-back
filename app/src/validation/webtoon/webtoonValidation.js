"use strict";

const { query, param } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper.js");

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

const checkWebtoonId = createValidation(
  param("webtoonId").isInt({ min: 1 }).withMessage("webtoonId는 1 이상의 정수여야 합니다.")
);

module.exports = {
  checkWebtoonQuery,
  checkWebtoonId,
};
