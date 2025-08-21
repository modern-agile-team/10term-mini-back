"use strict";

const { body, query } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper");

const checkSortParam = createValidation(
  query("sort")
    .optional()
    .isIn(["updated", "recent"])
    .withMessage("정렬 기준은 'updated' 또는 'recent'만 허용됩니다.")
);

const checkDeleteWebtoonIds = createValidation(
  body("webtoonIds")
    .isArray({ min: 1 })
    .withMessage("삭제할 웹툰 ID 배열을 전달해야 합니다.")
    .bail()
    .custom((arr) => arr.every((id) => Number.isInteger(id) && id > 0))
    .withMessage("웹툰 ID는 양의 정수여야 합니다.")
);

module.exports = {
  checkSortParam,
  checkDeleteWebtoonIds,
};
