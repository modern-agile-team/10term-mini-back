"use strict";

class CustomError extends Error {
  constructor(message, statusCode, field = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.field = field;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
