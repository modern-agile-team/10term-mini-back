"use strict";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

function setRefreshToken(res, token) {
  res.cookie("refreshToken", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshToken(res) {
  res.clearCookie("refreshToken", {
    ...cookieOptions,
  });
}

module.exports = { setRefreshToken, clearRefreshToken };
