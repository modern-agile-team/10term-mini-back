"use strict";

const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const authToken = bearerToken.split(" ")[1];

  try {
    const userPayload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = userPayload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
const optionalAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const authToken = bearerToken.split(" ")[1];

  try {
    const userPayload = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
    const { id } = userPayload;
    req.user = { id };
  } catch (error) {
    req.user = null;
  } finally {
    next();
  }
};

module.exports = { requireAuth, optionalAuth };
