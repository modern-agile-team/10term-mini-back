"use strict";

const { body, validationResult } = require("express-validator");

const checkAddComment = [
  body("content").notEmpty().withMessage("내용을 입력해주세요."),
  body("parentId").optional({ nullable: true }).isInt().withMessage("parentId는 정수여야 합니다."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.status(400).json({ success: false, data: { messages } });
    }
    next();
  },
];

const checkUpdateComment = [
  body("content").notEmpty().withMessage("수정할 내용을 입력해주세요."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.status(400).json({ success: false, data: { messages } });
    }
    next();
  },
];

const checkReactionType = [
  body("type")
    .exists()
    .withMessage("type 필드는 필수입니다.")
    .isIn(["like", "dislike", "none"])
    .withMessage("type은 'like', 'dislike', 'none' 중 하나여야 합니다."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      return res.status(400).json({ success: false, data: { messages } });
    }
    next();
  },
];

module.exports = { checkAddComment, checkUpdateComment, checkReactionType };
