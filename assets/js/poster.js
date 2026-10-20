/* =========================================================
   结果海报（Canvas 手绘 → PNG）
   750 x 1334，适合手机保存 / 发朋友圈 / 发小红书
   ========================================================= */

window.LOVE_POSTER = (function () {
  'use strict';

  var W = 750, H = 1334;
  var INK = '#241f1b';
  var INK2 = '#4e453c';
  var INK3 = '#8b7c69';
  var GOLD = '#a7894f';
  var RED = '#9c3a2c';
  var PAPER = '#f7efdc';
  var SERIF = '"Songti SC","STSong","SimSun","Noto Serif CJK SC",serif';

  function font(size, bold) {
    return (bold ? 'bold ' : '') + size + 'px ' + SERIF;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* 行尾标点不孤行：。，、！？；：）」等可以轻微出格 */
  var NO_HEAD = '。，、！？；：）」》”！？';

  function canStartLine(ch) {
    return NO_HEAD.indexOf(ch) === -1;
  }

  /* 按字符宽度折行（中文友好，带标点避头尾） */
  function wrap(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = String(text).split('');
    var line = '';
    for (var i = 0; i < chars.length; i++) {
      var test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line && canStartLine(chars[i])) {
        ctx.fillText(line, x, y);
        line = chars[i];
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) { ctx.fillText(line, x, y); y += lineHeight; }
    return y;
  }

  function hexPoints(cx, cy, R, vals) {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 3;
      var r = R * (0.16 + 0.84 * (Math.max(0, Math.min(100, vals[i])) / 100));
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function ring(ctx, cx, cy, R, k) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 3;
      var x = cx + Math.cos(a) * R * k;
      var y = cy + Math.sin(a) * R * k;
      if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
    }
    ctx.closePath();
  }

  function drawRadar(ctx, cx, cy, R, vals, names) {
    ctx.save();

    /* 网格 */
    for (var l = 1; l <= 4; l++) {
      ring(ctx, cx, cy, R, l / 4);
      ctx.strokeStyle = 'rgba(167,137,79,' + (l === 4 ? 0.5 : 0.25) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* 轴线 */
    ctx.strokeStyle = 'rgba(167,137,79,0.35)';
    ctx.lineWidth = 1;
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }

    /* 数据面 */
    var pts = hexPoints(cx, cy, R, vals);
    ctx.beginPath();
    pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(156,58,44,0.16)';
    ctx.fill();
    ctx.strokeStyle = RED;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    /* 顶点 */
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 4.2, 0, Math.PI * 2);
      ctx.fillStyle = RED;
      ctx.fill();
    });

    /* 标签 */
    ctx.font = font(21);
    ctx.fillStyle = INK2;
    for (var j = 0; j < 6; j++) {
      var ang = -Math.PI / 2 + j * Math.PI / 3;
      var lx = cx + Math.cos(ang) * (R + 30);
      var ly = cy + Math.sin(ang) * (R + 30);
      var cos = Math.cos(ang);
      ctx.textAlign = cos > 0.3 ? 'left' : (cos < -0.3 ? 'right' : 'center');
      ctx.textBaseline = 'middle';
      ctx.fillText(names[j], lx, ly);
    }

    ctx.restore();
  }

  function render(data) {
    return new Promise(function (resolve) {
      var canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext('2d');

      /* 纸底 */
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      var g = ctx.createRadialGradient(W * 0.5, -H * 0.1, 80, W * 0.5, H * 0.4, H);
      g.addColorStop(0, 'rgba(255,253,246,0.95)');
      g.addColorStop(0.55, 'rgba(247,238,218,0.2)');
      g.addColorStop(1, 'rgba(226,208,174,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* 双线边框 + 角标 */
      ctx.strokeStyle = 'rgba(167,137,79,0.55)';
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, W - 56, H - 56);
      ctx.strokeStyle = 'rgba(167,137,79,0.28)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, W - 80, H - 80);

      ctx.strokeStyle = 'rgba(156,58,44,0.5)';
      ctx.lineWidth = 2;
      [[28, 28], [W - 28, 28], [28, H - 28], [W - 28, H - 28]].forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(p[0] - 12, p[1]);
        ctx.lineTo(p[0] + 12, p[1]);
        ctx.moveTo(p[0], p[1] - 12);
        ctx.lineTo(p[0], p[1] + 12);
        ctx.stroke();
      });

      /* 页眉 */
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = font(22);
      ctx.fillStyle = INK3;
      ctx.fillText('恋 爱 人 格 · 古 人 也 恋 爱', W / 2, 122);

      /* 人格标签 */
      ctx.font = font(62, true);
      ctx.fillStyle = RED;
      ctx.fillText(data.label, W / 2, 198);

      /* 匹配人物 */
      ctx.font = font(25);
      ctx.fillStyle = INK2;
      ctx.fillText('最匹配 · ' + data.dynasty + ' ' + data.figure + '型', W / 2, 244);

      /* 雷达 */
      drawRadar(ctx, W / 2, 468, 112, data.vec, data.axes);

      /* 分隔 */
      ctx.strokeStyle = 'rgba(167,137,79,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(90, 646);
      ctx.lineTo(W - 90, 646);
      ctx.stroke();

      /* 场景 */
      ctx.textAlign = 'left';
      ctx.font = font(19);
      ctx.fillStyle = GOLD;
      ctx.fillText('你 们 的 恋 爱 场 景', 82, 690);

      ctx.font = font(27);
      ctx.fillStyle = INK;
      var y = wrap(ctx, data.scene, 82, 742, W - 164, 46);

      /* 磨合点 */
      var boxTop = y + 16;
      ctx.font = font(22);
      var lines = [];
      var tmp = '';
      String(data.friction).split('').forEach(function (ch) {
        if (ctx.measureText(tmp + ch).width > W - 220 && tmp && canStartLine(ch)) { lines.push(tmp); tmp = ch; }
        else { tmp += ch; }
      });
      if (tmp) { lines.push(tmp); }
      var boxH = 74 + (lines.length - 1) * 34;

      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(156,58,44,0.4)';
      ctx.lineWidth = 1.4;
      roundRect(ctx, 82, boxTop, W - 164, boxH, 6);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = RED;
      ctx.font = font(16);
      ctx.fillText('磨 合 点', 104, boxTop + 30);

      ctx.fillStyle = INK2;
      ctx.font = font(21);
      lines.forEach(function (ln, i) {
        ctx.fillText(ln, 104, boxTop + 60 + i * 34);
      });

      /* 性格分析金句（居中） */
      if (data.insight) {
        ctx.textAlign = 'center';
        ctx.font = font(21);
        var qLines = [];
        var qTmp = '';
        String('「' + data.insight + '」').split('').forEach(function (ch) {
          if (ctx.measureText(qTmp + ch).width > 560 && qTmp && canStartLine(ch)) { qLines.push(qTmp); qTmp = ch; }
          else { qTmp += ch; }
        });
        if (qTmp) { qLines.push(qTmp); }
        var qy = boxTop + boxH + 74;
        ctx.fillStyle = INK3;
        qLines.forEach(function (ln, i) {
          ctx.fillText(ln, W / 2, qy + i * 38);
        });
      }

      /* 底部 */
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(167,137,79,0.3)';
      ctx.beginPath();
      ctx.moveTo(90, H - 168);
      ctx.lineTo(W - 90, H - 168);
      ctx.stroke();

      ctx.font = font(23);
      ctx.fillStyle = INK2;
      ctx.fillText('测测你最适合跟哪位历史人物谈恋爱', W / 2, H - 118);

      ctx.font = font(18);
      ctx.fillStyle = INK3;
      ctx.fillText('长按保存 · 发给你想 @ 的那个人', W / 2, H - 82);

      /* 印章 */
      ctx.save();
      ctx.translate(W - 108, H - 250);
      ctx.rotate(-5 * Math.PI / 180);
      ctx.strokeStyle = 'rgba(156,58,44,0.55)';
      ctx.lineWidth = 3;
      roundRect(ctx, -33, -33, 66, 66, 4);
      ctx.stroke();
      ctx.fillStyle = 'rgba(156,58,44,0.7)';
      ctx.font = font(38);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('缘', 0, 2);
      ctx.restore();

      /* 输出 */
      var filename = '恋爱人格_' + data.label + '_' + data.figure + '.png';
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
          resolve({ url: URL.createObjectURL(blob), blob: blob, filename: filename });
        }, 'image/png');
      } else {
        resolve({ url: canvas.toDataURL('image/png'), blob: null, filename: filename });
      }
    });
  }

  return { render: render };
})();
