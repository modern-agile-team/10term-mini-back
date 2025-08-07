"use strict";

const { validationResult } = require("express-validator");

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsFormatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({ success: false, data: { errors: errorsFormatted } });
  }
  next();
};

const createValidation = (...rules) => [...rules, handleValidationResult];

module.exports = { createValidation };
