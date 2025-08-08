"use strict";

const { body, param } = require("express-validator");
const { createValidation } = require("@middleware/validationHelper.js");

const checkNicknameUpdate = createValidation(
  body("newNickname").custom((value) => {
    if (value.length < 2 || value.length > 30) {
      throw new Error("닉네임은 2자 이상 30자 이하로 입력해주세요.");
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
      throw new Error("닉네임은 한글, 영어, 숫자만 허용됩니다.");
    }

    const korean = value.match(/[가-힣]/g) || [];
    if (korean.length > 10) {
      throw new Error("닉네임 한글은 최대 10자까지 허용됩니다.");
    }

    return true;
  })
);

const checkPasswordUpdate = createValidation(
  body("currentPassword").notEmpty().withMessage("현재 비밀번호를 입력해주세요."),
  body("newPassword")
    .notEmpty()
    .withMessage("새 비밀번호를 입력해주세요.")
    .isLength({ min: 8, max: 20 })
    .withMessage("새 비밀번호는 8 ~ 20 글자여야 합니다.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/\\|])/)
    .withMessage("새 비밀번호는 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.")
);

const checkNicknameParam = createValidation(
  param("nickname")
    .isLength({ min: 2, max: 30 })
    .withMessage("닉네임은 2자 이상 30자 이하로 입력해주세요.")
    .matches(/^[가-힣a-zA-Z0-9]+$/)
    .withMessage("닉네임은 한글, 영어, 숫자만 허용됩니다.")
);

module.exports = {
  checkNicknameUpdate,
  checkPasswordUpdate,
  checkNicknameParam,
};
