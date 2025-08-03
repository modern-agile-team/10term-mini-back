"use strict";

const { validationResult } = require("express-validator");

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, data: { messages } });
  }
  next();
};

const createValidation = (...rules) => [...rules, handleValidationResult];

module.exports = { createValidation };