"use strict";

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "서버 오류가 발생했습니다." : err.message;
  const field = err.field || [];

  console.error(err.stack);

  const responseData = { message };
  if (field.length > 0) responseData.field = field;

  res.status(statusCode).json({
    success: false,
    data: responseData,
  });
};
