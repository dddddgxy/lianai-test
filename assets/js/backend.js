/* =========================================================
   数据层：Supabase 封装
   ---------------------------------------------------------
   前台只用两个函数：checkCode（查次数）/ consumeCode（扣一次）
   后台用 auth + codes + results 三组接口
   所有写操作都走数据库函数，前端拿不到 service_role 权限
   ========================================================= */

window.LA_DB = (function () {
  'use strict';

  var cfg = window.LA_CONFIG;
  var client = null;

  function ready() {
    return !!(cfg && cfg.isConfigured());
  }

  function getClient() {
    if (client) { return client; }
    if (!ready()) { throw new Error('NOT_CONFIGURED'); }
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('SDK_NOT_LOADED');
    }
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
    return client;
  }

  /* 把各种异常翻译成一句人话 */
  function humanError(err) {
    if (!err) { return '出了点问题，再试一次。'; }
    var msg = String(err.message || err.error_description || err || '');
    if (err.code === 'NOT_CONFIGURED' || msg === 'NOT_CONFIGURED') {
      return '后端还没配置：请在 assets/js/config.js 填入 Supabase 地址和 anon key。';
    }
    if (err.code === 'SDK_NOT_LOADED' || msg === 'SDK_NOT_LOADED') {
      return '网络没加载到数据库 SDK，检查一下网络或刷新页面。';
    }
    if (/Failed to fetch|NetworkError|network/i.test(msg)) {
      return '连不上数据库，检查网络后重试。';
    }
    if (/Invalid login credentials/i.test(msg)) {
      return '邮箱或密码不对。';
    }
    if (/Email not confirmed/i.test(msg)) {
      return '这个账号还没验证邮箱，去 Supabase 后台确认一下。';
    }
    if (/row-level security|permission denied/i.test(msg)) {
      return '没有权限：确认你的邮箱已写入 admins 表。';
    }
    if (/does not exist|Could not find the function|schema cache/i.test(msg)) {
      return '数据库还没建表：请先执行 supabase/schema.sql。';
    }
    return msg.slice(0, 120) || '出了点问题，再试一次。';
  }

  /* 统一取 rpc 结果：函数返回 jsonb，data 就是那个对象 */
  function rpc(name, args) {
    return getClient().rpc(name, args).then(function (res) {
      if (res.error) { throw res.error; }
      return res.data;
    });
  }

  /* ---------------- 离线兜底 ----------------
     Supabase 没配置时也能用：密码自带校验位（codes.js），
     次数记录在本机 localStorage。换设备/清缓存会重置，
     接入 Supabase 后自动切回数据库计数。 */
  var OFF_KEY = 'la_offline_usage_v1';

  function offRead() {
    try { return JSON.parse(window.localStorage.getItem(OFF_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function offMax() { return (cfg && cfg.defaultMaxUses) || 3; }

  function offCheck(code) {
    if (!window.LOVE_CODES || !window.LOVE_CODES.isValid(code)) {
      return { ok: false, reason: 'not_found' };
    }
    var rec = offRead()[code];
    var used = (rec && rec.used) || 0;
    var max = offMax();
    var remaining = Math.max(0, max - used);
    if (remaining <= 0) {
      return { ok: false, reason: 'exhausted', used: used, max: max, remaining: 0 };
    }
    return { ok: true, used: used, max: max, remaining: remaining, offline: true };
  }

  function offConsume(payload) {
    var r = offCheck(payload && payload.code);
    if (!r.ok) { return Promise.resolve(r); }
    var all = offRead();
    var rec = all[payload.code] || { used: 0, first: Date.now() };
    rec.used += 1;
    rec.last = Date.now();
    all[payload.code] = rec;
    try { window.localStorage.setItem(OFF_KEY, JSON.stringify(all)); } catch (e) { /* 忽略 */ }
    return Promise.resolve({
      ok: true, used: rec.used, max: r.max,
      remaining: Math.max(0, r.max - rec.used), offline: true
    });
  }

  /* ---------------- 前台 ---------------- */

  /* 只查不扣：{ ok, reason, used, max, remaining } */
  function checkCode(code) {
    if (!ready()) { return Promise.resolve(offCheck(code)); }
    return rpc('check_invite_code', { p_code: code });
  }

  /* 扣一次并记录结果：{ ok, reason, used, max, remaining } */
  function consumeCode(payload) {
    if (!ready()) { return offConsume(payload); }
    return rpc('consume_invite_code', {
      p_code: payload.code,
      p_entry: payload.entry || null,
      p_archetype: payload.archetype || null,
      p_figure: payload.figure || null,
      p_rate: typeof payload.rate === 'number' ? payload.rate : null,
      p_vector: payload.vector || null,
      p_answers: payload.answers || null
    });
  }

  /* ---------------- 后台 ---------------- */

  function signIn(email, password) {
    return getClient().auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) { throw res.error; }
        return res.data;
      });
  }

  function signOut() {
    return getClient().auth.signOut();
  }

  function getSession() {
    return getClient().auth.getSession().then(function (res) {
      return res.data ? res.data.session : null;
    });
  }

  function onAuthChange(cb) {
    return getClient().auth.onAuthStateChange(function (evt, session) {
      cb(evt, session);
    });
  }

  /* 列表：按生成时间倒序 */
  function listCodes() {
    return getClient()
      .from('invite_codes')
      .select('id, code, batch, note, max_uses, used_count, revoked, created_at, last_used_at')
      .order('created_at', { ascending: false })
      .limit(2000)
      .then(function (res) {
        if (res.error) { throw res.error; }
        return res.data || [];
      });
  }

  /* 批量插入（后台生成后用） */
  function createCodes(rows) {
    return getClient()
      .from('invite_codes')
      .insert(rows)
      .select('id, code, batch, max_uses, used_count, created_at')
      .then(function (res) {
        if (res.error) { throw res.error; }
        return res.data || [];
      });
  }

  /* 改一个密码（停用 / 改次数 / 改批次） */
  function updateCode(id, patch) {
    return getClient()
      .from('invite_codes')
      .update(patch)
      .eq('id', id)
      .select('id, code, batch, note, max_uses, used_count, revoked, created_at, last_used_at')
      .then(function (res) {
        if (res.error) { throw res.error; }
        return (res.data || [])[0];
      });
  }

  /* 删一个密码（连带结果里的 code_id 置空，不删结果） */
  function deleteCode(id) {
    return getClient().from('invite_codes').delete().eq('id', id).then(function (res) {
      if (res.error) { throw res.error; }
      return true;
    });
  }

  /* 最近结果 */
  function listResults(limit) {
    return getClient()
      .from('quiz_results')
      .select('id, code, entry, archetype, figure, match_rate, created_at')
      .order('created_at', { ascending: false })
      .limit(limit || 200)
      .then(function (res) {
        if (res.error) { throw res.error; }
        return res.data || [];
      });
  }

  return {
    ready: ready,
    humanError: humanError,
    checkCode: checkCode,
    consumeCode: consumeCode,
    signIn: signIn,
    signOut: signOut,
    getSession: getSession,
    onAuthChange: onAuthChange,
    listCodes: listCodes,
    createCodes: createCodes,
    updateCode: updateCode,
    deleteCode: deleteCode,
    listResults: listResults
  };
})();
