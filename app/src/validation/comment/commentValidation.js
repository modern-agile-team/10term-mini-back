"use strict";

const { body, param } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper");

const checkAddComment = createValidation(
  body("content").notEmpty().withMessage("내용을 입력해주세요."),
  body("parentId")
    .optional({ nullable: true })
    .isInt()
    .withMessage("parentId는 null이거나 숫자여야 합니다.")
);

const checkUpdateComment = createValidation(
  body("content").notEmpty().withMessage("수정할 내용을 입력해주세요.")
);

const checkReactionType = createValidation(
  body("type")
    .custom((value) => {
      return ["like", "dislike"].includes(value);
    })
    .withMessage("type은 'like' 또는 'dislike'만 허용됩니다.")
);

const checkCommentIdParam = createValidation(
  param("commentId").isInt({ min: 1 }).withMessage("댓글 ID는 1 이상의 정수여야 합니다.")
);

const checkEpisodeIdParam = createValidation(
  param("episodeId").isInt({ min: 1 }).withMessage("에피소드 ID는 1 이상의 정수여야 합니다.")
);

module.exports = {
  checkAddComment,
  checkUpdateComment,
  checkReactionType,
  checkCommentIdParam,
  checkEpisodeIdParam,
};
