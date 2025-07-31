"use strict";

function convertUTCtoKST(dateInput) {
  if (!dateInput) return null;

  const utcDate = new Date(dateInput);
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(utcDate.getTime() + kstOffset);

  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

module.exports = {
  convertUTCtoKST,
};
