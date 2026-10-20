/* =========================================================
   后台逻辑：Supabase 版
   ---------------------------------------------------------
   登录用 Supabase Auth（邮箱 + 密码），
   权限由数据库 RLS 控制：邮箱不在 admins 表里就读不到数据。
   ========================================================= */

(function () {
  'use strict';

  var CODES = window.LOVE_CODES;
  var XLSX = window.LOVE_XLSX;
  var DB = window.LA_DB;
  var CFG = window.LA_CONFIG;

  var $ = function (id) { return document.getElementById(id); };

  var records = [];
  var results = [];
  var me = null;

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function stamp(iso) {
    if (!iso) { return '—'; }
    var d = new Date(iso);
    if (isNaN(d.getTime())) { return '—'; }
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2200);
  }

  function copy(text, cb) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallback(text)); });
    } else {
      cb(fallback(text));
    }
  }

  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function statusOf(r) {
    if (r.revoked) { return { key: 'off', text: '已停用' }; }
    if (r.used_count >= r.max_uses) { return { key: 'done', text: '已用完' }; }
    if (r.used_count > 0) { return { key: 'part', text: '使用中' }; }
    return { key: 'new', text: '未使用' };
  }

  /* ---------- 登录 ---------- */
  function showLoginError(msg) {
    var err = $('admin-login-err');
    if (!msg) { err.hidden = true; return; }
    err.hidden = false;
    err.textContent = msg;
  }

  function unlockUI(session) {
    me = session && session.user ? session.user.email : '';
    $('admin-who').textContent = me ? '已登录：' + me : '';
    $('admin-login').hidden = true;
    $('admin-panel').hidden = false;
    showLoginError('');
    reloadAll();
  }

  function lockUI() {
    me = null;
    records = [];
    results = [];
    $('admin-panel').hidden = true;
    $('admin-login').hidden = false;
    $('admin-pass').value = '';
  }

  function bindLogin() {
    if (!DB.ready()) {
      showLoginError('后端还没配置：请打开 assets/js/config.js 填入 Supabase 地址和 anon key，并执行 supabase/schema.sql。');
      $('admin-login-btn').disabled = true;
      $('admin-email').disabled = true;
      $('admin-pass').disabled = true;
      return;
    }

    var btn = $('admin-login-btn');

    function submit() {
      var email = $('admin-email').value.trim();
      var pass = $('admin-pass').value;

      if (!email || !pass) { showLoginError('邮箱和密码都要填。'); return; }

      btn.disabled = true;
      btn.textContent = '登录中…';
      showLoginError('');

      DB.signIn(email, pass).then(function (data) {
        btn.disabled = false;
        btn.textContent = '进入';
        if (!data || !data.session) { showLoginError('登录失败，再试一次。'); return; }
        unlockUI(data.session);
      }).catch(function (e) {
        btn.disabled = false;
        btn.textContent = '进入';
        showLoginError(DB.humanError(e));
      });
    }

    btn.addEventListener('click', submit);
    $('admin-pass').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { submit(); }
    });

    $('btn-logout').addEventListener('click', function () {
      DB.signOut().then(function () { lockUI(); });
    });

    DB.getSession().then(function (s) {
      if (s) { unlockUI(s); }
    }).catch(function () { /* 未登录 */ });
  }

  /* ---------- 数据 ---------- */
  function reloadAll() {
    $('stat').textContent = '加载中…';
    Promise.all([DB.listCodes(), DB.listResults(200)]).then(function (res) {
      records = res[0] || [];
      results = res[1] || [];
      render();
      renderResults();
    }).catch(function (e) {
      $('stat').textContent = '加载失败';
      toast(DB.humanError(e));
    });
  }

  function render() {
    var tbody = $('code-tbody');
    var empty = $('empty-tip');

    var total = records.length;
    var used = records.reduce(function (s, r) { return s + r.used_count; }, 0);
    var alive = records.filter(function (r) {
      return !r.revoked && r.used_count < r.max_uses;
    }).length;

    $('stat').textContent = '共 ' + total + ' 个密码 · 可用 ' + alive + ' 个 · 已用 ' + used + ' 次';

    if (!total) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    tbody.innerHTML = records.map(function (r, i) {
      var st = statusOf(r);
      var left = Math.max(0, r.max_uses - r.used_count);
      return '<tr>' +
        '<td>' + (total - i) + '</td>' +
        '<td class="mono">' + CODES.format(r.code) + '</td>' +
        '<td>' + (r.batch ? esc(r.batch) : '—') + '</td>' +
        '<td class="col-use">' + r.used_count + ' / ' + r.max_uses + '</td>' +
        '<td class="col-use"><span class="badge badge--' + st.key + '">' + (r.revoked ? '—' : left) + '</span></td>' +
        '<td>' + stamp(r.created_at) + '</td>' +
        '<td class="col-act">' +
          '<button class="mini-btn" type="button" data-copy="' + i + '">复制</button>' +
          '<button class="mini-btn mini-btn--ghost" type="button" data-toggle="' + i + '">' +
            (r.revoked ? '启用' : '停用') +
          '</button>' +
          '<button class="mini-btn mini-btn--danger" type="button" data-del="' + i + '">删</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    tbody.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var r = records[Number(btn.getAttribute('data-copy'))];
        copy(CODES.format(r.code), function (ok) {
          btn.textContent = ok ? '已复制' : '失败';
          setTimeout(function () { btn.textContent = '复制'; }, 1200);
        });
      });
    });

    tbody.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var r = records[Number(btn.getAttribute('data-toggle'))];
        btn.disabled = true;
        DB.updateCode(r.id, { revoked: !r.revoked }).then(function () {
          btn.disabled = false;
          toast(r.revoked ? '已重新启用' : '已停用，这个密码不能再用了');
          reloadAll();
        }).catch(function (e) {
          btn.disabled = false;
          toast(DB.humanError(e));
        });
      });
    });

    tbody.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var r = records[Number(btn.getAttribute('data-del'))];
        if (!window.confirm('删除 ' + CODES.format(r.code) + '？\n\n已产生的测试结果会保留，但这个密码将永久失效。')) { return; }
        btn.disabled = true;
        DB.deleteCode(r.id).then(function () {
          toast('已删除');
          reloadAll();
        }).catch(function (e) {
          btn.disabled = false;
          toast(DB.humanError(e));
        });
      });
    });
  }

  function renderResults() {
    var tbody = $('result-tbody');
    var empty = $('result-empty');
    $('result-count').textContent = results.length ? results.length + ' 条' : '';

    if (!results.length) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    var entryText = { female: '女生入口', male: '男生入口', unknown: '—' };

    tbody.innerHTML = results.map(function (r) {
      return '<tr>' +
        '<td>' + stamp(r.created_at) + '</td>' +
        '<td>' + (entryText[r.entry] || esc(r.entry || '—')) + '</td>' +
        '<td>' + (r.archetype ? esc(r.archetype) : '—') + '</td>' +
        '<td>' + (r.figure ? esc(r.figure) : '—') + '</td>' +
        '<td class="col-use">' + (r.match_rate == null ? '—' : r.match_rate + '%') + '</td>' +
        '<td class="mono">' + CODES.format(r.code) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ---------- 生成 ---------- */
  function generate() {
    var n = parseInt($('gen-count').value, 10);
    var uses = parseInt($('gen-uses').value, 10);
    if (!n || n < 1) { n = 1; }
    if (n > 200) { n = 200; }
    if (!uses || uses < 1) { uses = CFG.defaultMaxUses || 3; }
    if (uses > 99) { uses = 99; }

    var batch = $('gen-batch').value.trim() || null;
    var list = CODES.makeMany(n);

    var rows = list.map(function (c) {
      return { code: c, batch: batch, max_uses: uses, used_count: 0 };
    });

    var btn = $('gen-btn');
    btn.disabled = true;
    btn.textContent = '写入中…';

    DB.createCodes(rows).then(function (data) {
      btn.disabled = false;
      btn.textContent = '生成';

      copy(list.map(function (c) { return CODES.format(c); }).join('\n'), function (ok) {
        toast(ok ? '已生成 ' + n + ' 个（每个 ' + uses + ' 次），并复制到剪贴板'
                 : '已生成 ' + n + ' 个（每个 ' + uses + ' 次）');
      });
      reloadAll();
    }).catch(function (e) {
      btn.disabled = false;
      btn.textContent = '生成';
      toast(DB.humanError(e));
    });
  }

  /* ---------- 导出 ---------- */
  function exportXlsx() {
    if (!records.length) { toast('还没有密码可以导出'); return; }

    var head = ['序号', '邀请密码', '批次', '已用次数', '可用上限', '剩余次数', '状态', '生成时间', '最后使用'];
    var rows = [head];

    records.slice().reverse().forEach(function (r, i) {
      var st = statusOf(r);
      rows.push([
        i + 1,
        CODES.format(r.code),
        r.batch || '',
        r.used_count,
        r.max_uses,
        Math.max(0, r.max_uses - r.used_count),
        st.text,
        stamp(r.created_at),
        stamp(r.last_used_at)
      ]);
    });

    var d = new Date();
    var name = '邀请密码_' + d.getFullYear() +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ('0' + d.getDate()).slice(-2) + '.xlsx';

    XLSX.download(name, rows, '邀请密码');
    toast('已导出 ' + (rows.length - 1) + ' 条');
  }

  /* ---------- 查密码 ---------- */
  function checkCode() {
    var v = $('check-input').value;
    var out = $('check-result');
    out.classList.remove('ok', 'bad');

    if (!v.trim()) {
      out.textContent = '先粘贴一个密码。';
      return;
    }

    var code = CODES.normalize(v);
    out.textContent = '查询中…';

    DB.checkCode(code).then(function (r) {
      out.classList.remove('ok', 'bad');
      if (!r) { out.textContent = '查询失败，再试一次。'; return; }

      if (r.ok) {
        out.classList.add('ok');
        out.textContent = '✓ ' + CODES.format(code) + ' 可用，还剩 ' +
          r.remaining + ' 次（已用 ' + r.used + ' / ' + r.max + '）。';
      } else if (r.reason === 'exhausted') {
        out.classList.add('bad');
        out.textContent = '✗ ' + CODES.format(code) + ' 的 ' + r.max + ' 次已全部用完。';
      } else if (r.reason === 'revoked') {
        out.classList.add('bad');
        out.textContent = '✗ ' + CODES.format(code) + ' 已被停用。';
      } else {
        out.classList.add('bad');
        out.textContent = '✗ 数据库里没有这个密码。';
      }
    }).catch(function (e) {
      out.classList.add('bad');
      out.textContent = DB.humanError(e);
    });
  }

  /* ---------- 绑定 ---------- */
  function bind() {
    $('gen-btn').addEventListener('click', generate);
    $('export-xlsx').addEventListener('click', exportXlsx);
    $('btn-reload').addEventListener('click', reloadAll);
    $('check-btn').addEventListener('click', checkCode);
    $('check-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { checkCode(); }
    });

    $('copy-all').addEventListener('click', function () {
      var list = records.filter(function (r) {
        return !r.revoked && r.used_count < r.max_uses;
      });
      if (!list.length) { toast('没有剩余可用的密码'); return; }
      copy(list.map(function (r) { return CODES.format(r.code); }).join('\n'), function (ok) {
        toast(ok ? '已复制 ' + list.length + ' 个可用密码' : '复制失败，请用导出 Excel');
      });
    });
  }

  /* ---------- 启动 ---------- */
  bindLogin();
  bind();
})();
