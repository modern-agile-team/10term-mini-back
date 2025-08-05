"use strict";

const { body, param } = require("express-validator");
const { createValidation } = require("../../common/middleware/validationHelper.js");

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
      if (value === null) return true;
      return ["like", "dislike"].includes(value);
    })
    .withMessage("type은 null이거나 'like', 'dislike' 중 하나여야 합니다.")
);

const checkCommentIdParam = createValidation(
  param("commentId")
    .exists()
    .withMessage("댓글 ID가 필요합니다.")
    .isInt({ min: 1 })
    .withMessage("댓글 ID는 1 이상의 정수여야 합니다.")
);

const checkEpisodeIdParam = createValidation(
  param("episodeId")
    .exists()
    .withMessage("에피소드 ID가 필요합니다.")
    .isInt({ min: 1 })
    .withMessage("에피소드 ID는 1 이상의 정수여야 합니다.")
);

module.exports = {
  checkAddComment,
  checkUpdateComment,
  checkReactionType,
  checkCommentIdParam,
  checkEpisodeIdParam,
};
