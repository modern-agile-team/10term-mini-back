"use strict";

const pool = require("@config/db");

/**
 * DB 연결 객체 반환
 *
 * 전달된 연결 객체(conn)가 있으면 사용하고, 없으면 기본 pool 반환
 * repository에서 트랜잭션 적용 등 유연한 DB 연결에 활용됨
 *
 * @param {Object} conn - 이미 생성된 MySQL 연결 객체 (선택)
 * @returns {Object} - 사용할 DB 연결(pool 또는 전달된 conn)
 */
function getDb(conn) {
  return conn ?? pool;
}

module.exports = getDb;
