"use strict";

const { body } = require("express-validator");
const { createValidation } = require("../../common/middleware/validationHelper.js");

const checkAddUser = createValidation(
  body("username")
    .isLength({ min: 5, max: 20 })
    .withMessage("아이디는 5 ~ 20자여야 합니다.")
    .matches(/^[a-z0-9_-]+$/)
    .withMessage("아이디는 소문자, 숫자, _, - 만 허용됩니다."),

  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("비밀번호는 8 ~ 20자여야 합니다.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/\\|])/)
    .withMessage("비밀번호는 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다."),

  body("nickname").custom((value) => {
    const korean = value.match(/[가-힣]/g) || [];
    const others = value.replace(/[가-힣]/g, "");
    if (korean.length > 10) {
      throw new Error("닉네임 한글은 최대 10자까지 허용됩니다.");
    }
    if (others.length > 30) {
      throw new Error("닉네임 영문/숫자는 최대 30자까지 허용됩니다.");
    }
    if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) {
      throw new Error("닉네임은 한글, 영어, 숫자만 허용됩니다.");
    }
    return true;
  })
);

const checkUser = createValidation(
  body("username").notEmpty().withMessage("아이디를 입력해주세요."),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요"),
);

module.exports = { checkAddUser, checkUser };
