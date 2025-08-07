"use strict";

const { query, param, validationResult } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper.js");

const checkWebtoonQuery = [
  query("day")
    .optional()
    .isIn(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
    .withMessage("요일이 올바르지 않습니다."),

  query("sort")
    .optional()
    .isIn(["favorite", "view", "updated", "rate"])
    .withMessage("정렬이 올바르지 않습니다."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.status(400).json({ success: false, data: { messages } });
    }
    next();
  },
];

const checkWebtoonId = [
  param("webtoonId").isInt({ min: 1 }).withMessage("webtoonId는 1 이상의 정수여야 합니다."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.status(400).json({ success: false, data: { messages } });
    }
    next();
  },
];

module.exports = {
  checkWebtoonQuery,
  checkWebtoonId,
};
