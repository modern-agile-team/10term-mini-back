"use strict";

const UserRepository = require("@repositories/user/userRepository.js");
const CustomError = require("@utils/customError");
const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getMyInfo(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError("존재하지 않는 유저입니다.", 404);
    }
    return user;
  }

  async updateNickname(userId, newNickname) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError("존재하지 않는 유저입니다.", 404);
    }

    if (user.nickname === newNickname) {
      throw new CustomError("새 닉네임이 현재 닉네임과 같습니다.", 400);
    }

    const existingNickname = await this.userRepository.findByNickname(newNickname);
    if (existingNickname) {
      throw new CustomError("이미 사용 중인 닉네임입니다.", 409);
    }

    await this.userRepository.updateNickname(userId, newNickname);
  }

  async checkNicknameDuplicate(nickname) {
    const user = await this.userRepository.findByNickname(nickname);
    return user ? true : false;
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError("존재하지 않는 유저입니다.", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new CustomError("현재 비밀번호가 일치하지 않습니다.", 400);
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) throw new CustomError("새 비밀번호는 현재 비밀번호와 달라야 합니다.", 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}

module.exports = UserService;
