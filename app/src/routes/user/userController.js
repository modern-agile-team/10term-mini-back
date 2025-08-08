"use strict";

const UserService = require("@services/user/userService.js");
const userService = new UserService();

module.exports = {
  getMyInfo: async (req, res, next) => {
    const userId = req.user.id;
    const user = await userService.getMyInfo(userId);

    return res.status(200).json({
      success: true,
      data: {
        message: "내 정보 조회 성공",
        content: {
          nickname: user.nickname,
        },
      },
    });
  },

  updateNickname: async (req, res, next) => {
    const userId = req.user.id;
    const { newNickname } = req.body;
    await userService.updateNickname(userId, newNickname);

    return res.status(200).json({
      success: true,
      data: {
        message: "닉네임이 성공적으로 변경되었습니다.",
      },
    });
  },

  checkNicknameDuplicate: async (req, res, next) => {
    const { nickname } = req.params;
    const isDuplicate = await userService.checkNicknameDuplicate(nickname);

    return res.status(200).json({
      success: true,
      data: {
        message: "닉네임 중복 검사 성공",
        content: {
          isAvailable: !isDuplicate,
        },
      },
    });
  },

  updatePassword: async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(userId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      data: {
        message: "비밀번호가 성공적으로 변경되었습니다.",
      },
    });
  },
};
