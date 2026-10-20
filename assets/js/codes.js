/* =========================================================
   邀请密码（纯前端，无后端）
   ---------------------------------------------------------
   密码自带校验位：LA + 8 位随机码 + 3 位校验码。
   任何设备都能离线验证，不需要数据库；生成记录只保存在
   管理页本机的 localStorage 里。
   注意：纯静态站点的密码只能挡“随手点进来的人”，
   不能当作真正的安全机制。
   ========================================================= */

window.LOVE_CODES = (function () {
  'use strict';

  /* 去掉 0/O/1/I 等容易看错的字符 */
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var SECRET = 'lianai-guoxue-2026';
  var PREFIX = 'LA';
  var BODY_LEN = 8;
  var SUM_LEN = 3;

  function fnv(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function checksum(body) {
    var h = fnv(SECRET + '|' + body);
    var out = '';
    for (var i = 0; i < SUM_LEN; i++) {
      out += ALPHABET[(h >>> (i * 5)) & 31];
    }
    return out;
  }

  function randChar() {
    if (window.crypto && window.crypto.getRandomValues) {
      var buf = new Uint8Array(1);
      window.crypto.getRandomValues(buf);
      return ALPHABET[buf[0] & 31];
    }
    return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  function normalize(code) {
    return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  function make() {
    var body = '';
    for (var i = 0; i < BODY_LEN; i++) { body += randChar(); }
    return PREFIX + body + checksum(PREFIX + body);
  }

  function isValid(code) {
    var c = normalize(code);
    if (c.length !== PREFIX.length + BODY_LEN + SUM_LEN) { return false; }
    if (c.indexOf(PREFIX) !== 0) { return false; }
    var body = c.slice(0, PREFIX.length + BODY_LEN);
    var sum = c.slice(PREFIX.length + BODY_LEN);
    return checksum(body) === sum;
  }

  /* LA-XXXX-XXXX-XXX */
  function format(code) {
    var c = normalize(code);
    if (c.length !== 13) { return c; }
    return c.slice(0, 2) + '-' + c.slice(2, 6) + '-' + c.slice(6, 10) + '-' + c.slice(10);
  }

  function makeMany(n) {
    var list = [], guard = 0;
    while (list.length < n && guard < n * 50) {
      var c = make();
      if (list.indexOf(c) === -1) { list.push(c); }
      guard++;
    }
    return list;
  }

  return {
    make: make,
    makeMany: makeMany,
    isValid: isValid,
    normalize: normalize,
    format: format,           /* 展示用：LA-XXXX-XXXX-XXX */
    raw: normalize,           /* 存储用：去掉横线 */
    ALPHABET: ALPHABET
  };
})();
