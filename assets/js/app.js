/* =========================================================
   主逻辑
   0) 邀请密码门：次数存在 Supabase，开始答题查一次、出结果扣一次
   1) 选项累加维度分 → 每题中心化 → 归一化为 0-100 向量
   2) 先匹配「恋爱人格原型」，再在同型内按贴合度加权 + 答案哈希稳定抽签
   3) 六边形雷达 + 恋爱性格分析 + Canvas 结果海报
   4) 支持 ?entry=female&figure=sushi 直接复现结果
   ========================================================= */

(function () {
  'use strict';

  var DATA = window.LOVE_DATA;
  var QUIZ = window.QUIZ_DATA;
  var INS = window.LOVE_INSIGHT;
  var CODES = window.LOVE_CODES;
  var DB = window.LA_DB;
  var CFG = window.LA_CONFIG;
  if (!DATA || !QUIZ || !INS || !CODES || !DB) { return; }

  var AXES = DATA.axes.map(function (a) { return a.key; });
  var ARCH = DATA.archetypes;
  var FIGS = DATA.figures;
  var ENTRIES = DATA.entries;

  var GATE_KEY = 'la_love_pass';
  var gateMemory = null;   /* localStorage 不可用时的兜底 */

  /* ---------- 预计算：每个人格原型的质心 ---------- */
  var CENTROID = {};
  Object.keys(ARCH).forEach(function (aid) {
    var sum = AXES.map(function () { return 0; });
    var list = ARCH[aid].figures;
    list.forEach(function (fid) {
      FIGS[fid].vector.forEach(function (v, i) { sum[i] += v; });
    });
    CENTROID[aid] = sum.map(function (s) { return s / list.length; });
  });

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var views = {
    gate: $('view-gate'),
    home: $('view-home'),
    quiz: $('view-quiz'),
    result: $('view-result')
  };
  var elQuizCount = $('quiz-count');
  var elQuizTag = $('quiz-tag');
  var elProgress = $('progress-fill');
  var elProgressWrap = document.querySelector('.progress');
  var elQIndex = $('q-index');
  var elQText = $('q-text');
  var elQOptions = $('q-options');
  var elBack = $('btn-back');
  var elResult = $('result-root');

  /* ---------- 状态 ---------- */
  var state = {
    entry: null,
    index: 0,
    answers: [],
    userArr: null,
    figureId: null,
    shared: false,
    locked: false,
    posterUrl: null,
    code: '',
    quota: null,
    rate: null
  };

  /* =========================================================
     工具
     ========================================================= */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function dist(a, b) {
    var s = 0;
    for (var i = 0; i < AXES.length; i++) {
      var d = a[i] - b[i];
      s += d * d;
    }
    return Math.sqrt(s / AXES.length);
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  /* FNV-1a，返回 0-1 的稳定伪随机数 */
  function hashString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h / 4294967296;
  }

  /* =========================================================
     密码门
     ========================================================= */
  function savedCode() {
    if (gateMemory) { return gateMemory; }
    try { return window.localStorage.getItem(GATE_KEY) || ''; } catch (e) { return ''; }
  }

  function rememberUnlock(code) {
    gateMemory = code;
    try { window.localStorage.setItem(GATE_KEY, code); } catch (e) { /* 忽略 */ }
  }

  function forgetUnlock() {
    gateMemory = '';
    try { window.localStorage.removeItem(GATE_KEY); } catch (e) { /* 忽略 */ }
  }

  function reasonText(r) {
    if (!r) { return '验证失败，再试一次。'; }
    if (r.reason === 'not_found') { return '这个密码不存在，看看是不是输错了一位。'; }
    if (r.reason === 'revoked') { return '这个密码已被停用，找发链接给你的人换一个。'; }
    if (r.reason === 'exhausted') {
      return '这个密码的 ' + (r.max || 3) + ' 次机会已经用完了，找发链接给你的人再要一个。';
    }
    if (r.reason === 'empty') { return '先输密码。'; }
    return '验证失败，再试一次。';
  }

  function bindGate() {
    var input = $('gate-input');
    var btn = $('gate-btn');
    var err = $('gate-error');

    /* Supabase 没配置时走离线兜底（backend.js），只有一句小字提醒 */
    var maxEl = $('gate-max');
    if (maxEl && CFG && CFG.defaultMaxUses) { maxEl.textContent = String(CFG.defaultMaxUses); }
    if (!DB.ready()) {
      err.hidden = false;
      err.classList.add('is-soft');
      err.textContent = '当前为离线模式：次数记录在这台设备上，清除浏览器数据后会重置。';
    }

    function fail(msg) {
      err.hidden = false;
      err.classList.remove('is-soft');
      err.textContent = msg;
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
    }

    function busy(on) {
      btn.disabled = on;
      input.disabled = on;
      btn.textContent = on ? '验证中…' : '进入测试';
    }

    function submit() {
      if (btn.disabled) { return; }
      var code = CODES.normalize(input.value);

      if (code.length !== 13 || code.slice(0, 2) !== 'LA') {
        fail('密码是 LA 开头、共 13 位，比如 LA-ABCD-EFGH-JKL。');
        return;
      }

      err.hidden = true;
      busy(true);

      DB.checkCode(code).then(function (r) {
        busy(false);
        if (!r || !r.ok) {
          fail(reasonText(r));
          input.value = CODES.format(code);
          return;
        }
        rememberUnlock(code);
        state.code = code;
        state.quota = r;
        input.value = CODES.format(code);
        renderQuota();
        route();
      }).catch(function (e) {
        busy(false);
        fail(DB.humanError(e));
      });
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { submit(); }
    });
    input.addEventListener('input', function () {
      input.value = input.value.toUpperCase();
      err.hidden = true;
    });
    input.addEventListener('blur', function () {
      if (input.value) { input.value = CODES.format(input.value); }
    });

    /* 首页「换一个密码」 */
    $('btn-switch-code').addEventListener('click', function () {
      forgetUnlock();
      state.code = '';
      state.quota = null;
      renderQuota();
      $('gate-input').value = '';
      showView('gate');
    });
  }

  /* 首页剩余次数 */
  function renderQuota() {
    var wrap = $('home-quota');
    var num = $('home-remain');
    if (!wrap || !num) { return; }
    if (state.quota && typeof state.quota.remaining === 'number') {
      num.textContent = String(state.quota.remaining);
      wrap.hidden = false;
      wrap.classList.toggle('is-empty', state.quota.remaining <= 0);
    } else {
      wrap.hidden = true;
    }
  }

  /* =========================================================
     视图切换
     ========================================================= */
  function showView(name) {
    Object.keys(views).forEach(function (k) {
      views[k].hidden = (k !== name);
    });
    window.scrollTo(0, 0);
  }

  /* =========================================================
     计分
     ========================================================= */
  function computeVector(answers, questions) {
    var sums = {}, caps = {};

    AXES.forEach(function (k) { sums[k] = 0; caps[k] = 0; });

    questions.forEach(function (q, qi) {
      var qCap = {}, qMean = {};

      /* 每题的选项先做中心化：不同题目选项的“绝对偏移”不同，
         先减掉本题均值，避免题目之间互相污染，也让“都选中间项”回到 50 分。 */
      AXES.forEach(function (k) {
        var maxAbs = 0, sum = 0;
        q.options.forEach(function (o) {
          var v = (o.d && o.d[k]) || 0;
          maxAbs = Math.max(maxAbs, Math.abs(v));
          sum += v;
        });
        qCap[k] = maxAbs;
        qMean[k] = sum / q.options.length;
      });

      AXES.forEach(function (k) { caps[k] += (qCap[k] || 0); });

      var picked = q.options[answers[qi]];
      if (picked && picked.d) {
        AXES.forEach(function (k) {
          sums[k] += ((picked.d[k] || 0) - qMean[k]);
        });
      }
    });

    var out = [];
    AXES.forEach(function (k) {
      var cap = caps[k];
      var score = cap > 0 ? 50 + (sums[k] / cap) * 45 : 50;
      out.push(Math.round(clamp(score, 4, 96)));
    });
    return out;
  }

  /* =========================================================
     匹配
     ========================================================= */
  function pickArchetype(userArr) {
    var order = ENTRIES[state.entry].archetypeOrder;
    var best = order[0], bestD = Infinity;
    order.forEach(function (aid) {
      var d = dist(userArr, CENTROID[aid]);
      if (d < bestD - 1e-9) { bestD = d; best = aid; }
    });
    return best;
  }

  /**
   * 同一个人格原型下有多位人物：贴合度加权 + 答案哈希稳定抽签。
   * - 贴合度：用户向量相对原型质心的偏移，与该人物特征方向的投影
   * - 哈希：同一份答案永远得到同一个人物（可复现、可分享）
   * - FIGURE_FLOOR：给每个人物一个保底权重，避免某些人物永远轮不到；
   *   实测 64 位人物都能被选中，不同选择能出不同人。
   */
  var FIGURE_FLOOR = 0.5;
  var FIGURE_TEMP = 18;

  function pickFigure(userArr, aid, answers) {
    var list = ARCH[aid].figures;
    var center = CENTROID[aid];
    var userOffset = userArr.map(function (v, i) { return v - center[i]; });

    var raw = list.map(function (fid) {
      var d = FIGS[fid].vector.map(function (v, i) { return v - center[i]; });
      var len = Math.sqrt(d.reduce(function (s, v) { return s + v * v; }, 0)) || 1;
      var score = d.reduce(function (s, v, i) { return s + v * userOffset[i]; }, 0) / len;
      return Math.exp(score / FIGURE_TEMP);
    });

    var maxW = Math.max.apply(null, raw);
    var weights = raw.map(function (w) { return w + maxW * FIGURE_FLOOR; });

    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var r = hashString((answers || []).join('')) * total;
    var acc = 0;
    for (var i = 0; i < list.length; i++) {
      acc += weights[i];
      if (r <= acc) { return list[i]; }
    }
    return list[list.length - 1];
  }

  function matchRate(userArr, figArr) {
    var d = dist(userArr, figArr);
    return Math.round(clamp(100 - d * 1.15, 58, 99));
  }

  /* =========================================================
     六边形雷达
     ========================================================= */
  function radarSvg(vec) {
    var cx = 160, cy = 152, R = 88;
    var i;

    function pt(idx, r) {
      var ang = -Math.PI / 2 + idx * Math.PI / 3;
      return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
    }

    function polygon(k) {
      var pts = [];
      for (var j = 0; j < 6; j++) {
        var p = pt(j, R * k);
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      }
      return pts.join(' ');
    }

    var grid = '';
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      grid += '<polygon class="radar-grid" points="' + polygon(k) + '"></polygon>';
    });

    var spokes = '';
    for (i = 0; i < 6; i++) {
      var e = pt(i, R);
      spokes += '<line class="radar-spoke" x1="' + cx + '" y1="' + cy +
        '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '"></line>';
    }

    var dataPts = [];
    var dots = '';
    for (i = 0; i < 6; i++) {
      var val = clamp(vec[i], 0, 100);
      var r = R * (0.16 + 0.84 * val / 100);
      var p = pt(i, r);
      dataPts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      dots += '<circle class="radar-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2"></circle>';
    }

    var labels = '';
    DATA.axes.forEach(function (ax, idx) {
      var ang = -Math.PI / 2 + idx * Math.PI / 3;
      var lx = cx + Math.cos(ang) * (R + 26);
      var ly = cy + Math.sin(ang) * (R + 26);
      var cos = Math.cos(ang);
      var anchor = cos > 0.3 ? 'start' : (cos < -0.3 ? 'end' : 'middle');
      labels += '<text class="radar-label" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) +
        '" text-anchor="' + anchor + '" dominant-baseline="middle">' +
        esc(ax.high) +
        '<tspan class="radar-val" dx="4">' + vec[idx] + '</tspan></text>';
    });

    return '<div class="radar-wrap">' +
      '<svg class="radar" viewBox="0 0 320 300" role="img" aria-label="六维恋爱倾向图">' +
      '<g>' + grid + spokes + '</g>' +
      '<polygon class="radar-area" points="' + dataPts.join(' ') + '"></polygon>' +
      '<g>' + dots + '</g>' +
      labels +
      '</svg></div>';
  }

  /* =========================================================
     恋爱性格分析
     ========================================================= */
  function buildAnalysis(userArr, archId, answers) {
    var items = DATA.axes.map(function (ax, i) {
      return {
        key: ax.key,
        idx: i,
        sal: Math.abs(userArr[i] - 50),
        pole: userArr[i] >= 50 ? 'high' : 'low'
      };
    });
    items.sort(function (x, y) { return y.sal - x.sal; });

    var seedStr = answers && answers.length ? answers.join('') : archId;
    var s1 = hashString(seedStr);
    var s2 = hashString(seedStr + '#');

    function line(item, s) {
      var arr = INS.axis[item.key][item.pole];
      return arr[Math.floor(s * arr.length) % arr.length];
    }

    /* 组合洞察：在所有命中的组合里，取“偏离最大”的那条 */
    var combo = null, bestSal = -1;
    INS.combos.forEach(function (c) {
      var ok = true, sal = 0;
      Object.keys(c.when).forEach(function (k) {
        var idx = AXES.indexOf(k);
        if (idx < 0) { ok = false; return; }
        if ((userArr[idx] >= 50 ? 'high' : 'low') !== c.when[k]) { ok = false; return; }
        sal += Math.abs(userArr[idx] - 50);
      });
      if (ok && sal > bestSal) { bestSal = sal; combo = c.text; }
    });

    return {
      first: line(items[0], s1),
      second: line(items[1], s2),
      combo: combo || INS.fallback,
      closing: INS.closing[archId] || ''
    };
  }

  /* =========================================================
     测试流程
     ========================================================= */
  var starting = false;

  /* 点入口：先问数据库这个密码还剩几次，再决定让不让答 */
  function startQuiz(entry) {
    if (!ENTRIES[entry] || starting) { return; }

    var code = state.code || savedCode();
    if (!code) { showView('gate'); return; }

    if (state.quota && state.quota.remaining <= 0) {
      toast('这个密码的次数已经用完了');
      return;
    }

    starting = true;
    var btn = document.querySelector('.entry--' + entry);
    if (btn) { btn.classList.add('is-busy'); }

    DB.checkCode(code).then(function (r) {
      starting = false;
      if (btn) { btn.classList.remove('is-busy'); }

      if (!r || !r.ok) {
        state.quota = r;
        renderQuota();
        toast(reasonText(r));
        return;
      }
      state.quota = r;
      renderQuota();
      beginQuiz(entry);
    }).catch(function (e) {
      starting = false;
      if (btn) { btn.classList.remove('is-busy'); }
      toast(DB.humanError(e));
    });
  }

  function beginQuiz(entry) {
    state.entry = entry;
    state.index = 0;
    state.answers = [];
    state.userArr = null;
    state.figureId = null;
    state.shared = false;
    state.locked = false;
    state.rate = null;

    elQuizTag.textContent = ENTRIES[entry].tag;
    showView('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var qs = QUIZ[state.entry].questions;
    var q = qs[state.index];
    var total = qs.length;

    state.locked = false;

    elQIndex.textContent = '第 ' + (state.index + 1) + ' 题';
    elQText.textContent = q.text;
    elQuizCount.textContent = pad2(state.index + 1) + ' / ' + total;

    var pct = Math.round((state.index / total) * 100);
    elProgress.style.width = pct + '%';
    elProgressWrap.setAttribute('aria-valuenow', String(pct));

    elBack.disabled = state.index === 0;

    var picked = state.answers[state.index];
    elQOptions.innerHTML = q.options.map(function (o, i) {
      var mark = 'ABCD'.charAt(i);
      var cls = 'opt' + (picked === i ? ' is-picked' : '');
      return '<button class="' + cls + '" type="button" data-opt="' + i + '">' +
        '<span class="opt-mark">' + mark + '</span>' +
        '<span class="opt-text">' + esc(o.text) + '</span>' +
        '</button>';
    }).join('');

    var card = document.querySelector('.q-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  }

  function chooseOption(i) {
    if (state.locked) { return; }
    state.locked = true;
    state.answers[state.index] = i;

    var nodes = elQOptions.querySelectorAll('.opt');
    for (var n = 0; n < nodes.length; n++) {
      nodes[n].classList.toggle('is-picked', Number(nodes[n].getAttribute('data-opt')) === i);
    }

    var qs = QUIZ[state.entry].questions;
    window.setTimeout(function () {
      if (state.index < qs.length - 1) {
        state.index += 1;
        renderQuestion();
        window.scrollTo(0, 0);
      } else {
        elProgress.style.width = '100%';
        finish();
      }
    }, 190);
  }

  function finish() {
    var qs = QUIZ[state.entry].questions;
    state.userArr = computeVector(state.answers, qs);

    var aid = pickArchetype(state.userArr);
    var fid = pickFigure(state.userArr, aid, state.answers);
    state.figureId = fid;
    state.shared = false;
    state.rate = matchRate(state.userArr, FIGS[fid].vector);

    /* 先把结果算完并显示，扣次数在后台走，网络慢也不卡住用户 */
    showView('result');
    elResult.innerHTML =
      '<div class="result-loading">' +
        '<span class="seal" aria-hidden="true">算</span>' +
        '<p>正在给你排这一卦…</p>' +
      '</div>';

    var code = state.code || savedCode();

    DB.consumeCode({
      code: code,
      entry: state.entry,
      archetype: aid,
      figure: fid,
      rate: state.rate,
      vector: state.userArr,
      answers: (state.answers || []).join('')
    }).then(function (r) {
      state.quota = r;
      renderQuota();

      if (r && r.ok && r.remaining === 0) {
        window.setTimeout(function () { toast('这是这个密码的最后一次机会'); }, 600);
      } else if (r && !r.ok) {
        /* 并发撞车：结果已经算出来了还是给你，但要说清楚 */
        window.setTimeout(function () { toast('注意：这个密码的次数已经用完了'); }, 600);
      }
      renderResult(fid);
    }).catch(function (e) {
      /* 网络失败：结果照给，但必须让用户知道这次没记上 */
      renderResult(fid);
      window.setTimeout(function () { toast(DB.humanError(e)); }, 600);
    });
  }

  /* =========================================================
     结果
     ========================================================= */
  function renderResult(fid) {
    var fig = FIGS[fid];
    if (!fig) { goHome(); return; }

    var aid = fig.archetype;
    var arch = ARCH[aid];
    var entry = arch.entry;

    state.entry = entry;
    state.figureId = fid;

    var userArr = state.userArr ? state.userArr.slice() : fig.vector.slice();
    var rate = state.shared ? null
      : (typeof state.rate === 'number' ? state.rate : matchRate(userArr, fig.vector));
    var analysis = buildAnalysis(userArr, aid, state.answers);

    var tagsHtml = fig.tags.map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('');

    var matchHtml = state.shared
      ? '<div class="match-line">同款人格 · 结果来自分享链接</div>'
      : '<div class="match-line">性格相似度 <b>' + rate + '%</b></div>';

    var tipsHtml = arch.tips.map(function (t) {
      return '<li>' + esc(t) + '</li>';
    }).join('');

    elResult.innerHTML =
      '<div class="result-sheet">' +
        '<div class="result-head">' +
          '<span class="eyebrow">你的恋爱人格</span>' +
          '<h1 class="result-label">' + esc(arch.label) + '</h1>' +
          '<p class="result-tagline">' + esc(arch.tagline) + '</p>' +
        '</div>' +

        '<div class="figure-card">' +
          '<div class="figure-meta">' +
            '<span>' + esc(fig.dynasty) + '</span><span>·</span>' +
            '<span class="fig-arch">' + esc(arch.title) + '</span>' +
          '</div>' +
          '<div class="figure-name">' + esc(fig.name) + '<small>型</small></div>' +
          '<div class="figure-tags">' + tagsHtml + '</div>' +
          matchHtml +
        '</div>' +

        '<section class="panel panel--radar">' +
          '<h3 class="panel-title">你的六维倾向<small>' +
            (state.shared ? '该类人格典型分布' : '按你的选择计算') + '</small></h3>' +
          radarSvg(userArr) +
        '</section>' +

        '<section class="panel panel--insight">' +
          '<h3 class="panel-title">恋爱性格分析<small>这段话只对你写</small></h3>' +
          '<div class="insight">' +
            '<p class="insight-main">' + esc(analysis.first) + esc(analysis.second) + '</p>' +
            '<p class="insight-key">' + esc(analysis.combo) + '</p>' +
            '<p class="insight-end">' + esc(analysis.closing) + '</p>' +
          '</div>' +
        '</section>' +

        '<section class="panel">' +
          '<h3 class="panel-title">你们的恋爱场景</h3>' +
          '<p class="scene-text">' + esc(fig.scene) + '</p>' +
        '</section>' +

        '<section class="panel">' +
          '<h3 class="panel-title">磨合点 · 雷点</h3>' +
          '<p class="friction-text">' + esc(fig.friction) + '</p>' +
        '</section>' +

        '<section class="panel">' +
          '<h3 class="panel-title">相处建议</h3>' +
          '<ol class="tips">' + tipsHtml + '</ol>' +
        '</section>' +

        '<div class="result-actions result-actions--main">' +
          '<button class="btn-primary" id="btn-poster" type="button">生成结果海报</button>' +
        '</div>' +
        '<div class="result-actions result-actions--sub">' +
          '<button class="btn-ghost" id="btn-restart" type="button">再测一次</button>' +
          '<button class="btn-ghost" id="btn-link" type="button">复制结果链接</button>' +
        '</div>' +

        '<p class="result-note">海报可直接保存到相册，发给你想 @ 的那个人。</p>' +
      '</div>';

    bindResult(entry, fid, userArr, fig, arch, analysis);
    setUrl(entry, fid);
    showView('result');
  }

  function bindResult(entry, fid, userArr, fig, arch, analysis) {
    $('btn-restart').addEventListener('click', function () {
      history.replaceState(null, '', location.pathname);
      startQuiz(entry);
    });

    $('btn-link').addEventListener('click', function () {
      copyText(location.href, function (ok) {
        toast(ok ? '结果链接已复制' : '复制失败，请长按地址栏复制');
      });
    });

    $('btn-poster').addEventListener('click', function () {
      var btn = this;
      if (btn.disabled) { return; }
      btn.disabled = true;
      btn.textContent = '正在生成…';

      window.LOVE_POSTER.render({
        label: arch.label,
        dynasty: fig.dynasty,
        figure: fig.name,
        scene: fig.scene,
        friction: fig.friction,
        insight: analysis.combo,
        vec: userArr,
        axes: DATA.axes.map(function (a) { return a.high; })
      }).then(function (res) {
        openPoster(res);
        btn.disabled = false;
        btn.textContent = '生成结果海报';
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = '生成结果海报';
        toast('生成失败，请再试一次');
      });
    });
  }

  /* =========================================================
     海报弹层
     ========================================================= */
  function openPoster(res) {
    var modal = $('poster-modal');
    var img = $('poster-img');
    var dl = $('poster-download');

    if (state.posterUrl) {
      try { URL.revokeObjectURL(state.posterUrl); } catch (e) { /* 忽略 */ }
    }
    state.posterUrl = res.url;

    img.src = res.url;
    dl.href = res.url;
    dl.download = res.filename;

    modal.hidden = false;
    document.body.classList.add('is-modal');
  }

  function closePoster() {
    $('poster-modal').hidden = true;
    document.body.classList.remove('is-modal');
  }

  function bindPoster() {
    $('poster-close').addEventListener('click', closePoster);
    $('poster-close2').addEventListener('click', closePoster);
    $('poster-modal').addEventListener('click', function (e) {
      if (e.target === this) { closePoster(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('poster-modal').hidden) { closePoster(); }
    });
  }

  /* =========================================================
     URL / 复制 / 提示
     ========================================================= */
  function setUrl(entry, fid) {
    var q = '?entry=' + encodeURIComponent(entry) + '&figure=' + encodeURIComponent(fid);
    try {
      history.replaceState(null, '', location.pathname + q);
    } catch (e) { /* file:// 下忽略 */ }
  }

  function copyText(text, cb) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallbackCopy(text)); });
    } else {
      cb(fallbackCopy(text));
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
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
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove('is-on'); }, 1800);
  }

  /* =========================================================
     首页 / 启动
     ========================================================= */
  function goHome() {
    history.replaceState(null, '', location.pathname);
    showView('home');
  }

  function fillCounts() {
    Object.keys(ENTRIES).forEach(function (key) {
      var n = 0;
      ENTRIES[key].archetypeOrder.forEach(function (aid) { n += ARCH[aid].figures.length; });
      var node = document.querySelector('[data-count="' + key + '"]');
      if (node) { node.textContent = String(n); }
    });
  }

  function bindHome() {
    document.querySelectorAll('.entry').forEach(function (btn) {
      btn.addEventListener('click', function () {
        startQuiz(btn.getAttribute('data-entry'));
      });
    });
  }

  function bindQuiz() {
    elQOptions.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.opt') : null;
      if (!btn) { return; }
      chooseOption(Number(btn.getAttribute('data-opt')));
    });

    elBack.addEventListener('click', function () {
      if (state.index === 0) { return; }
      state.index -= 1;
      state.locked = false;
      renderQuestion();
    });

    $('btn-quit').addEventListener('click', goHome);
  }

  function route() {
    var params = new URLSearchParams(location.search);
    var fid = params.get('figure');
    var entry = params.get('entry');

    if (fid && FIGS[fid]) {
      var aid = FIGS[fid].archetype;
      state.entry = ARCH[aid].entry;
      if (entry && ENTRIES[entry] && ARCH[aid].entry !== entry) {
        state.entry = ARCH[aid].entry;   /* 参数冲突时以人物所属入口为准 */
      }
      state.shared = true;
      state.userArr = null;
      state.answers = [];
      renderResult(fid);
      return;
    }

    if (entry && ENTRIES[entry]) {
      startQuiz(entry);
      return;
    }

    showView('home');
  }

  /* 静默刷新剩余次数，失败不打扰用户 */
  function refreshQuota() {
    if (!state.code) { return Promise.resolve(); }
    return DB.checkCode(state.code).then(function (r) {
      state.quota = r;
      renderQuota();
      return r;
    }).catch(function () { return null; });
  }

  function boot() {
    fillCounts();
    bindHome();
    bindQuiz();
    bindGate();
    bindPoster();

    state.code = savedCode();

    /* 分享链接（?figure=xxx）：别人没输过密码也能直接看结果，
       这条路径不消耗任何次数，也不写数据库 */
    var sharedFid = new URLSearchParams(location.search).get('figure');
    if (sharedFid && FIGS[sharedFid]) {
      route();
      return;
    }

    if (!state.code) {
      showView('gate');
      return;
    }

    /* 记住的密码也要再验一次：可能次数用完了或已失效 */
    DB.checkCode(state.code).then(function (r) {
      if (r && r.ok) {
        state.quota = r;
        route();
        renderQuota();
      } else {
        forgetUnlock();
        state.code = '';
        state.quota = null;
        showView('gate');
      }
    }).catch(function () {
      route();
    });
  }

  boot();
})();
