"use strict";

const app = require("../app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버가 실행 중입니다.`);
});